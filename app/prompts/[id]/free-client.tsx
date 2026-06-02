"use client";

export default function FreePromptClient({ prompt, session }: { prompt: any; session: any }) {

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.text);
    await fetch("/api/prompts/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: prompt.id, type: "copy" }),
    });
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px" }}>

      {/* Image */}
      {prompt.imageUrl && (
        <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "32px", maxWidth: "320px", margin: "0 auto 32px", aspectRatio: "3/4" }}>
          <img src={prompt.imageUrl} alt={prompt.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Prompt text */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{prompt.text}</p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
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
            
             <a key={tag.id}
              href={`/prompts?tag=${tag.name}`}
              style={{ padding: "4px 12px", borderRadius: "999px", border: "1px solid var(--border)", fontSize: "12px", color: "var(--text-muted)", textDecoration: "none", cursor: "pointer" }}
            >
              {tag.name}
            </a>
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