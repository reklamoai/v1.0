"use client";
import { useState } from "react";
import Link from "next/link";

export default function BoardListClient({ boards: initialBoards }: { boards: any[] }) {
  const [boards, setBoards] = useState(initialBoards);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  async function createBoard() {
    if (!title.trim()) return;
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, isPublic }),
    });
    const board = await res.json();
    setBoards((prev) => [{ ...board, _count: { items: 0 } }, ...prev]);
    setTitle("");
    setCreating(false);
  }

  async function deleteBoard(id: string) {
    await fetch(`/api/boards/${id}`, { method: "DELETE" });
    setBoards((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="grid-bg" />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              Marketing Boards
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Organizo dhe planifiko prompts-et e tua
            </p>
          </div>
          <button
            onClick={() => setCreating(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--accent)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Board i ri
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
          }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "16px" }}>
              Board i ri
            </p>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createBoard()}
              placeholder="Emri i board-it..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                fontSize: "14px",
                outline: "none",
                marginBottom: "12px",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                Bëje publik
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => { setCreating(false); setTitle(""); }}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}
                >
                  Anulo
                </button>
                <button
                  onClick={createBoard}
                  disabled={!title.trim()}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: "var(--accent)", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", opacity: title.trim() ? 1 : 0.5 }}
                >
                  Krijo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Boards grid */}
        {boards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📋</p>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
              Nuk ke boards ende
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Krijo board-in e parë dhe fillo të organizosh prompts-et
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} onDelete={deleteBoard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BoardCard({ board, onDelete }: { board: any; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "12px",
        padding: "24px",
        transition: "border-color 0.15s, transform 0.15s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: hovered ? "var(--accent)" : "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.15s",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={hovered ? "#fff" : "var(--text-muted)"} strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); onDelete(board.id); }}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            backgroundColor: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <Link href={`/board/${board.id}`} style={{ textDecoration: "none" }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>
          {board.title}
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
          {board._count.items} prompts · {board.isPublic ? "Publik" : "Privat"}
        </p>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          fontWeight: 600,
          color: board.isPublic ? "#22c55e" : "var(--text-muted)",
          backgroundColor: board.isPublic ? "rgba(34,197,94,0.1)" : "var(--bg-secondary)",
          padding: "3px 8px",
          borderRadius: "20px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: board.isPublic ? "#22c55e" : "var(--text-muted)", display: "inline-block" }} />
          {board.isPublic ? "Publik" : "Privat"}
        </div>
      </Link>
    </div>
  );
}