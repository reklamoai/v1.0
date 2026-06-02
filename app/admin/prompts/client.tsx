"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPromptsClient({ prompts }: { prompts: any[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text)" }}>Prompts</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/admin/prompts/add-free"
            style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
          >
            + FREE
          </Link>
          <Link
            href="/admin/prompts/add-premium"
            style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "var(--accent)", color: "white", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
          >
            + PREMIUM
          </Link>
        </div>
      </div>

      {/* List */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        {prompts.length === 0 ? (
          <p style={{ padding: "24px", color: "var(--text-muted)", fontSize: "14px" }}>Nuk ka prompts ende.</p>
        ) : (
          prompts.map((prompt, i) => (
            <div
              key={prompt.id}
              style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 20px", borderBottom: i < prompts.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              {/* Thumbnail */}
              <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", backgroundColor: "var(--bg-secondary)", flexShrink: 0 }}>
                {prompt.imageUrl && (
                  <img src={prompt.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>

              {/* Serial + tier */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "14px", color: "var(--text)", fontWeight: 500 }}>{prompt.serialCode}</span>
              </div>

              {/* Tier badge */}
              <span style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: prompt.tier === "premium" ? "var(--accent)" : "var(--bg-secondary)",
                color: prompt.tier === "premium" ? "white" : "var(--text-muted)",
              }}>
                {prompt.tier.toUpperCase()}
              </span>

              {/* Actions */}
              <div style={{ display: "flex", gap: "16px" }}>
                <Link href={`/admin/prompts/edit/${prompt.id}`} style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>Edit</Link>
                <button onClick={() => handleDelete(prompt.id)} style={{ fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Trash</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}