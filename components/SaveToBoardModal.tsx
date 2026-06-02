"use client";
import { useState, useEffect } from "react";

interface Board {
  id: string;
  title: string;
  isPublic: boolean;
  _count: { items: number };
}

interface Props {
  promptId: string;
  promptTitle: string;
  onClose: () => void;
}

export default function SaveToBoardModal({ promptId, promptTitle, onClose }: Props) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPublic, setNewPublic] = useState(false);

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => r.json())
      .then((data) => { setBoards(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function saveToBoard(boardId: string) {
    setSaving(boardId);
    const res = await fetch("/api/boards/save-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId, boardId }),
    });
    if (res.ok) setSaved((prev) => [...prev, boardId]);
    setSaving(null);
  }

  async function createBoard() {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, isPublic: newPublic }),
    });
    const board = await res.json();
    setBoards((prev) => [{ ...board, _count: { items: 0 } }, ...prev]);
    setNewTitle("");
    setCreating(false);
    saveToBoard(board.id);
  }

  return (
    <>
      {/* Backdrop blur */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 200,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          animation: "modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "2px" }}>
              Ruaj në Board
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {promptTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Board list */}
        <div style={{ padding: "8px", maxHeight: "280px", overflowY: "auto" }}>
          {loading ? (
            <p style={{ textAlign: "center", padding: "32px", fontSize: "13px", color: "var(--text-muted)" }}>
              Duke ngarkuar...
            </p>
          ) : boards.length === 0 && !creating ? (
            <p style={{ textAlign: "center", padding: "32px", fontSize: "13px", color: "var(--text-muted)" }}>
              Nuk ke asnjë board ende.
            </p>
          ) : (
            boards.map((board) => {
              const isSaved = saved.includes(board.id);
              const isSaving = saving === board.id;
              return (
                <button
                  key={board.id}
                  onClick={() => !isSaved && saveToBoard(board.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: isSaved ? "rgba(255,85,0,0.06)" : "transparent",
                    cursor: isSaved ? "default" : "pointer",
                    transition: "background 0.15s",
                    marginBottom: "2px",
                  }}
                  onMouseEnter={(e) => { if (!isSaved) e.currentTarget.style.backgroundColor = "var(--bg-secondary)"; }}
                  onMouseLeave={(e) => { if (!isSaved) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Board icon */}
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>
                        {board.title}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {board._count.items} items · {board.isPublic ? "Publik" : "Privat"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: isSaved ? "var(--accent)" : "var(--bg-card)",
                    border: `1px solid ${isSaved ? "var(--accent)" : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}>
                    {isSaving ? (
                      <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        border: "2px solid var(--border)",
                        borderTopColor: "var(--accent)",
                        animation: "spin 0.6s linear infinite",
                      }} />
                    ) : isSaved ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 2v8M2 6h8" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Create new board */}
        <div style={{ padding: "8px", borderTop: "1px solid var(--border)" }}>
          {creating ? (
            <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createBoard()}
                placeholder="Emri i board-it..."
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text)",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-muted)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newPublic}
                    onChange={(e) => setNewPublic(e.target.checked)}
                    style={{ accentColor: "var(--accent)", width: "14px", height: "14px" }}
                  />
                  Bëje publik
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => { setCreating(false); setNewTitle(""); }}
                    style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
                  >
                    Anulo
                  </button>
                  <button
                    onClick={createBoard}
                    disabled={!newTitle.trim()}
                    style={{ padding: "6px 12px", borderRadius: "4px", border: "none", backgroundColor: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: newTitle.trim() ? 1 : 0.5 }}
                  >
                    Krijo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px dashed var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Krijo board të ri
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}