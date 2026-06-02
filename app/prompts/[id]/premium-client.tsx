"use client";
import { useState } from "react";

export default function PremiumPromptClient({ prompt, session }: { prompt: any; session: any }) {
  const attributes: any[] = Array.isArray(prompt.attributes) ? prompt.attributes : [];
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    attributes.forEach((attr) => {
      if (attr.type === "checkbox") {
        const opts = attr.options.split(",").map((o: string) => o.trim());
        init[attr.key] = opts[0] || "";
      } else if (attr.type === "dropdown") {
        const opts = attr.options.split(",").map((o: string) => o.trim());
        init[attr.key] = opts[0] || "";
      } else {
        init[attr.key] = attr.options || "";
      }
    });
    return init;
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  function generatePrompt() {
    let result = prompt.text;
    Object.entries(values).forEach(([key, val]) => {
      result = result.replaceAll(`[${key}]`, val);
    });
    setGeneratedPrompt(result);
  }

  async function handleCopy() {
    const text = generatedPrompt || prompt.text;
    await navigator.clipboard.writeText(text);
    await fetch("/api/prompts/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: prompt.id, type: "copy" }),
    });
  }

  async function handleSendToChatGPT() {
    const text = generatedPrompt || prompt.text;
    await fetch("/api/prompts/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: prompt.id, type: "chatgpt" }),
    });
    const encoded = encodeURIComponent(text);
    window.open(`https://chat.openai.com/?q=${encoded}`, "_blank");
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px" }}>

      {/* Image */}
      {prompt.imageUrl && (
        <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "32px", maxWidth: "320px", margin: "0 auto 32px", aspectRatio: "3/4" }}>
          <img src={prompt.imageUrl} alt={prompt.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Attributes */}
      {attributes.map((attr) => (
        <div key={attr.key} style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "8px" }}>
            {attr.label}
          </label>

          {attr.type === "text" && (
            <input
              value={values[attr.key] || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [attr.key]: e.target.value }))}
              style={{ width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text)", fontSize: "14px", outline: "none" }}
            />
          )}

          {attr.type === "checkbox" && (
            <div style={{ display: "flex", gap: "10px" }}>
              {attr.options.split(",").map((opt: string) => {
                const o = opt.trim();
                const isSelected = values[attr.key] === o;
                return (
                  <button
                    key={o}
                    onClick={() => setValues((prev) => ({ ...prev, [attr.key]: o }))}
                    style={{
                      padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: "none",
                      backgroundColor: isSelected ? "var(--accent)" : "var(--bg-card)",
                      color: isSelected ? "white" : "var(--text)",
                    }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          )}

          {attr.type === "dropdown" && (
            <select
              value={values[attr.key] || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [attr.key]: e.target.value }))}
              style={{ width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text)", fontSize: "14px", outline: "none", cursor: "pointer" }}
            >
              {attr.options.split(",").map((opt: string) => (
                <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Generate button */}
      {attributes.length > 0 && (
        <button
          onClick={generatePrompt}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--accent)", color: "white", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", marginBottom: "20px", letterSpacing: "0.05em" }}
        >
          GENERATE PROMPT
        </button>
      )}

      {/* Generated prompt */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {generatedPrompt || prompt.text}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <button
          onClick={handleSendToChatGPT}
          style={{ flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "#10a37f", color: "white", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Send to ChatGPT
        </button>
        <button
          onClick={handleCopy}
          style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          Copy Prompt
        </button>
      </div>

      {/* Category + Tags */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Kategoria</p>
        <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)" }}>{prompt.category?.name}</p>
      </div>

      <div>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>Keywords</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {prompt.tags.slice(0, 6).map((tag: any) => (
            <span key={tag.id} style={{ padding: "4px 12px", borderRadius: "999px", border: "1px solid var(--border)", fontSize: "12px", color: "var(--text-muted)" }}>
              {tag.name}
            </span>
          ))}
          {prompt.tags.length > 6 && (
            <span style={{ padding: "4px 12px", borderRadius: "999px", border: "1px solid var(--border)", fontSize: "12px", color: "var(--text-muted)" }}>
              +{prompt.tags.length - 6} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}