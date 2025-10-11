import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      text: "Hi! Ask about check-in/out, Wi-Fi, parking, cancellation...",
    },
  ]);

  const scrollerRef = useRef(null);

  useEffect(() => {
    if (scrollerRef.current)
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, open]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !busy,
    [input, busy]
  );

  async function send() {
    const msg = input.trim();
    if (!msg || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setBusy(true);
    try {
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await r.json().catch(() => ({}));
      const reply = data?.reply || "Sorry, I couldn’t process that.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Network error. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) send();
    }
  }

  const styles = {
    fab: {
      position: "fixed",
      right: "18px",
      bottom: "18px",
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: "#111827",
      color: "#fff",
      fontSize: "22px",
      border: "none",
      boxShadow: "0 10px 25px rgba(0,0,0,.2)",
      cursor: "pointer",
      zIndex: 9999,
    },
    panel: {
      position: "fixed",
      right: "18px",
      bottom: "86px",
      width: "340px",
      maxWidth: "calc(100vw - 36px)",
      height: "460px",
      background: "#fff",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 16px 40px rgba(0,0,0,.25)",
      transform: open ? "translateY(0)" : "translateY(20px)",
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transition: "all .18s ease",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
    },
    header: {
      height: "54px",
      background: "#111827",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 12px",
    },
    title: { fontWeight: 600 },
    closeBtn: {
      background: "transparent",
      border: "none",
      color: "#fff",
      fontSize: "22px",
      cursor: "pointer",
    },
    body: {
      flex: 1,
      padding: "12px",
      overflowY: "auto",
      background: "#f9fafb",
    },
    bubble: (role) => ({
      maxWidth: "85%",
      padding: "10px 12px",
      margin: "6px 0",
      borderRadius: "12px",
      lineHeight: "1.35",
      whiteSpace: "pre-wrap",
      boxShadow: "0 1px 2px rgba(0,0,0,.06)",
      alignSelf: role === "user" ? "flex-end" : "flex-start",
      background: role === "user" ? "#dbeafe" : "#fff",
      color: "#111",
      borderBottomRightRadius: role === "user" ? "4px" : "12px",
      borderBottomLeftRadius: role === "user" ? "12px" : "4px",
    }),
    inputBar: {
      height: "64px",
      display: "flex",
      gap: "8px",
      alignItems: "center",
      padding: "8px",
      borderTop: "1px solid #e5e7eb",
      background: "#fff",
    },
    textarea: {
      flex: 1,
      resize: "none",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "10px 12px",
      font: "inherit",
      outline: "none",
    },
    sendBtn: {
      width: "42px",
      height: "42px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: "#111827",
      color: "#fff",
      fontSize: "18px",
      opacity: canSend ? 1 : 0.5,
    },
  };

  return (
    <>
      <button style={styles.fab} onClick={() => setOpen((v) => !v)}>
        {open ? "×" : "💬"}
      </button>

      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.title}>Assistant</div>
          <button style={styles.closeBtn} onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <div style={styles.body} ref={scrollerRef}>
          {messages.map((m, i) => (
            <div key={i} style={styles.bubble(m.role)}>
              {m.text}
            </div>
          ))}
          {busy && (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Assistant is typing…
            </div>
          )}
        </div>

        <div style={styles.inputBar}>
          <textarea
            style={styles.textarea}
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button style={styles.sendBtn} disabled={!canSend} onClick={send}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
