"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Tag = { id: string; name: string };

export default function AdminTagsClient({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text)", marginBottom: "32px" }}>Tags</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Create a new Tag"
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text)", fontSize: "14px", outline: "none" }}
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "var(--accent)", color: "white", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Create
        </button>
      </div>

      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        {tags.length === 0 ? (
          <p style={{ padding: "24px", color: "var(--text-muted)", fontSize: "14px" }}>Nuk ka tags ende.</p>
        ) : (
          tags.map((tag, i) => (
            <div key={tag.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < tags.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: "14px", color: "var(--text)" }}>{tag.name}</span>
              <button onClick={() => handleDelete(tag.id)} style={{ fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Trash</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}