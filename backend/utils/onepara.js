const fs = require("fs");
const path = require("path");

const CTX_PATH = path.join(__dirname, "..", "data", "contexts.json");
console.log("Loading contexts from:", CTX_PATH);

let BIG_PARA = "Please add details in backend/data/contexts.json";
try {
  const arr = JSON.parse(fs.readFileSync(CTX_PATH, "utf-8"));
  if (Array.isArray(arr) && arr[0] && typeof arr[0].text === "string") {
    BIG_PARA = arr[0].text;
  }
} catch {
  console.warn("contexts.json missing or invalid");
}

/**
 * 1) NORMALIZE
 * Make text comparable: lowercase, unify characters, unify common variants,
 * remove punctuation, collapse spaces.
 */
function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/check[\s-]?in/g, "checkin") // "check in" / "check-in" → "checkin"
    .replace(/check[\s-]?out/g, "checkout") // "check out" / "check-out" → "checkout"
    .replace(/wi[\s-]?fi/g, "wifi") // "wi fi" / "wi-fi" → "wifi"
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // keep letters, numbers, spaces
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

/**
 * 2) SCORE
 * Word-overlap with tiny keyword boosts. Returns 0..1 (higher is better).
 */
const KEYWORDS = [
  "checkin",
  "checkout",
  "wifi",
  "parking",
  "cancellation",
  "refund",
  "fees",
  "time",
  "timing",

];
function score(query, sentence) {
  const q = normalize(query);
  const s = normalize(sentence);
  if (!q) return 0;

  const qTokens = new Set(q.split(" ").filter(Boolean));
  const sTokens = new Set(s.split(" ").filter(Boolean));

  let inter = 0;
  for (const t of qTokens) if (sTokens.has(t)) inter++;

  let base = inter / Math.max(1, qTokens.size); 
  for (const k of KEYWORDS) {
    if (q.includes(k) && s.includes(k)) base += 0.2; 
  }
  return Math.min(base, 1);
}

/**
 * 3) BEST SENTENCE
 * Split the big paragraph into sentences; pick the one with the highest score.
 */
function bestSentence(paragraph, query) {
  const sentences = paragraph.split(/(?<=[.!?])\s+/);
  if (!sentences.length) return { sentence: paragraph, score: 0 };

  let best = sentences[0],
    bestScore = -1;
  for (const s of sentences) {
    const sc = score(query, s);
    if (sc > bestScore) {
      bestScore = sc;
      best = s;
    }
  }
  return { sentence: best, score: bestScore };
}


function getBestFromParagraph(message) {
  const msg = (message || "").trim();
  if (!msg) return { sentence: "Please type a question.", score: 1 };
  return bestSentence(BIG_PARA, msg);
}
function getParagraph() {
  return BIG_PARA;
}

module.exports = { getBestFromParagraph, getParagraph, score };
