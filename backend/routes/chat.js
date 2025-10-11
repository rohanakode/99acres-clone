const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const router = express.Router();


const CTX_PATH = path.join(__dirname, "..", "data", "contexts.json");
let CONTEXTS = [];

try {
  const raw = fs.readFileSync(CTX_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  CONTEXTS = Array.isArray(parsed)
    ? parsed
        .map((x) => (typeof x === "string" ? x : x.text || ""))
        .filter(Boolean)
    : [];
  console.log("✅ contexts.json loaded with", CONTEXTS.length, "paragraph(s)");
} catch (e) {
  console.warn("⚠️ contexts.json missing or invalid:", e.message);
  CONTEXTS = [];
}

// ---------------------- TEXT NORMALIZATION ----------------------
function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/check[\s-]?in/g, "checkin")
    .replace(/check[\s-]?out/g, "checkout")
    .replace(/wi[\s-]?fi/g, "wifi")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s = "") {
  const stop = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "have",
    "he",
    "her",
    "him",
    "his",
    "i",
    "in",
    "is",
    "it",
    "its",
    "me",
    "my",
    "of",
    "on",
    "or",
    "our",
    "she",
    "that",
    "the",
    "their",
    "them",
    "there",
    "these",
    "they",
    "this",
    "to",
    "we",
    "what",
    "when",
    "where",
    "which",
    "who",
    "whom",
    "why",
    "will",
    "with",
    "you",
    "your",
    "yours",
  ]);
  return normalize(s)
    .split(" ")
    .filter((w) => w.length >= 3 && !stop.has(w));
}

function overlapScore(query = "", candidate = "") {
  const q = new Set(tokens(query));
  const c = new Set(tokens(candidate));
  if (q.size === 0) return 0;
  let hit = 0;
  for (const t of q) if (c.has(t)) hit++;
  return hit / q.size;
}

// ---------------------- PICK BEST SENTENCE ----------------------
function bestSentenceFromContexts(userMsg) {
  if (!CONTEXTS.length) return { sentence: "", score: 0 };

  const sentences = CONTEXTS.flatMap((p) =>
    String(p)
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
  );

  let best = "",
    bestScore = 0;
  for (const s of sentences) {
    const sc = overlapScore(userMsg, s);
    if (sc > bestScore) {
      best = s;
      bestScore = sc;
    }
  }
  return { sentence: best, score: bestScore };
}

// ---------------------- GEMINI MODEL CONFIG ----------------------
const GEMINI_MODEL = (process.env.GEMINI_MODEL || "gemini-2.5-flash").replace(
  /^models\//,
  ""
);
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

// ---------------------- GEMINI ANSWER FUNCTION ----------------------
async function askGemini(question, context = "") {
  const prompt = `
You are a friendly property assistant for a real estate website.
Answer clearly in 1–2 short sentences.
If FAQ context helps, use it; if not, answer generally.
Never mention "context" or internal rules.

FAQ / Policy Notes:
${context}

Question: ${question}
`;

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gemini HTTP ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const raw =
    parts
      .map((p) => p.text)
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "I’m not sure, but you can check the property page for more details.";
  return sanitizeAi(raw);
}

// ---------------------- CLEAN AI RESPONSES ----------------------
function sanitizeAi(s = "") {
  return s
    .replace(/the provided context[^.]*\./gi, "")
    .replace(/(based on|from) (the )?provided (site )?context[^.]*\./gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, 300)
    .trim();
}

// ---------------------- MAIN ROUTE ----------------------
const MATCH_THRESHOLD = 0.5;

router.post("/", async (req, res) => {
  const userMsg = (req.body?.message || "").trim();
  if (!userMsg) return res.status(400).json({ error: "empty_message" });

  const { sentence, score } = bestSentenceFromContexts(userMsg);

  console.log("[CTX] message:", userMsg);
  console.log("[CTX] bestSentence:", sentence);
  console.log("[CTX] score:", score);

  if (score >= MATCH_THRESHOLD && sentence) {
    const short =
      sentence.length > 220 ? sentence.slice(0, 220).trim() + "…" : sentence;
    return res.json({
      reply: short,
      source: "paragraph",
      confidence: score,
      debug: "v-sentences",
    });
  }

  try {
    const contextBlock = CONTEXTS.join("\n");
    const ai = await askGemini(userMsg, contextBlock);
    return res.json({
      reply: ai || "I’m not sure, but you can check the listing page.",
      source: "ai-gemini",
      confidence: 1,
      debug: "v-sentences",
    });
  } catch (err) {
    console.error("Gemini error:", err.message);
    return res.json({
      reply: "Sorry, something went wrong. Please try again later.",
      source: "ai-gemini-error",
      confidence: 0,
      debug: "v-sentences",
    });
  }
});

module.exports = router;
