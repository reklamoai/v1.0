"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const STATUSES = [
  { key: "idea", label: "Ide", color: "#888" },
  { key: "planned", label: "Planifikuar", color: "#f59e0b" },
  { key: "posted", label: "Postuar", color: "#22c55e" },
];

const PLATFORMS = ["Instagram", "Facebook", "TikTok", "Billboard", "Tjetër"];

export default function BoardDetailClient({ board: initialBoard }: { board: any }) {
  const [board, setBoard] = useState(initialBoard);
  const [view, setView] = useState<"kanban" | "calendar" | "list">("kanban");
  const [selectedItem, setSelectedItem] = useState<any>(null);

async function updateItem(itemId: string, data: any) {
  const res = await fetch(`/api/boards/${board.id}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("Update failed:", await res.text());
    return;
  }

  const updated = await res.json();
  setBoard((prev: any) => ({
    ...prev,
    items: prev.items.map((i: any) => i.id === itemId ? updated : i),
  }));
  if (selectedItem?.id === itemId) setSelectedItem(updated);
}

  async function deleteItem(itemId: string) {
    await fetch(`/api/boards/${board.id}/items/${itemId}`, { method: "DELETE" });
    setBoard((prev: any) => ({
      ...prev,
      items: prev.items.filter((i: any) => i.id !== itemId),
    }));
    if (selectedItem?.id === itemId) setSelectedItem(null);
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="grid-bg" />
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "80px 24px 40px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/board" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "13px" }}>
              ← Boards
            </Link>
            <span style={{ color: "var(--border)" }}>/</span>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text)" }}>
              {board.title}
            </h1>
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              color: board.isPublic ? "#22c55e" : "var(--text-muted)",
              backgroundColor: board.isPublic ? "rgba(34,197,94,0.1)" : "var(--bg-card)",
              padding: "3px 8px",
              borderRadius: "20px",
              border: "1px solid var(--border)",
            }}>
              {board.isPublic ? "Publik" : "Privat"}
            </span>
          </div>

          {/* View switcher */}
          <div style={{
            display: "flex",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "3px",
            gap: "2px",
          }}>
            {[
              { key: "kanban", label: "Kanban", icon: "⊞" },
              { key: "calendar", label: "Kalendarë", icon: "📅" },
              { key: "list", label: "Listë", icon: "≡" },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key as any)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: view === v.key ? "var(--bg)" : "transparent",
                  color: view === v.key ? "var(--text)" : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: view === v.key ? 600 : 400,
                  cursor: "pointer",
                  boxShadow: view === v.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        {view === "kanban" && (
          <KanbanView items={board.items} onUpdate={updateItem} onDelete={deleteItem} onSelect={setSelectedItem} />
        )}
        {view === "calendar" && (
          <CalendarView items={board.items} onSelect={setSelectedItem} />
        )}
        {view === "list" && (
          <ListView items={board.items} onUpdate={updateItem} onDelete={deleteItem} onSelect={setSelectedItem} />
        )}
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={(data: any) => updateItem(selectedItem.id, data)}
          onDelete={() => deleteItem(selectedItem.id)}
        />
      )}
    </div>
  );
}

// ── Kanban View ───────────────────────────────────────────
function KanbanView({ items, onUpdate, onDelete, onSelect }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
      {STATUSES.map((status) => (
        <div key={status.key}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: status.color, display: "inline-block" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {status.label}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", backgroundColor: "var(--bg-card)", padding: "1px 6px", borderRadius: "20px", border: "1px solid var(--border)" }}>
              {items.filter((i: any) => i.status === status.key).length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {items
              .filter((i: any) => i.status === status.key)
              .map((item: any) => (
                <KanbanCard key={item.id} item={item} statusColor={status.color} onUpdate={onUpdate} onDelete={onDelete} onSelect={onSelect} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function KanbanCard({ item, statusColor, onUpdate, onDelete, onSelect }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(item)}
      style={{
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.15s",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {item.prompt?.imageUrl && (
        <img
          src={item.prompt.imageUrl}
          alt={item.title}
          style={{ width: "100%", height: "120px", objectFit: "cover" }}
        />
      )}
      <div style={{ padding: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
          {item.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {item.prompt?.category && (
              <span style={{ fontSize: "10px", color: "var(--text-muted)", backgroundColor: "var(--bg-secondary)", padding: "2px 6px", borderRadius: "20px" }}>
                {item.prompt.category.name}
              </span>
            )}
            {item.platform && (
              <span style={{ fontSize: "10px", color: "var(--accent)", backgroundColor: "rgba(255,85,0,0.08)", padding: "2px 6px", borderRadius: "20px" }}>
                {item.platform}
              </span>
            )}
          </div>
          {item.scheduledAt && (
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
              {new Date(item.scheduledAt).toISOString().split("T")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Calendar View ─────────────────────────────────────────
function CalendarView({ items, onSelect }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const monthName = currentDate.toLocaleDateString("sq-AL", { month: "long", year: "numeric" });

  const itemsByDate: Record<string, any[]> = {};
  items.forEach((item: any) => {
    if (item.scheduledAt) {
      const key = new Date(item.scheduledAt).toISOString().split("T")[0];
      if (!itemsByDate[key]) itemsByDate[key] = [];
      itemsByDate[key].push(item);
    }
  });

  const days = ["Hë", "Ma", "Më", "En", "Pr", "Sh", "Di"];

  return (
    <div>
      {/* Calendar header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text)", cursor: "pointer" }}
        >
          ←
        </button>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>
          {monthName}
        </p>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text)", cursor: "pointer" }}
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
        {days.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", padding: "8px 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {Array.from({ length: adjustedFirstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ minHeight: "80px" }} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayItems = itemsByDate[dateKey] || [];
          const isToday = new Date().toISOString().split("T")[0] === dateKey;

          return (
            <div
              key={day}
              style={{
                minHeight: "80px",
                backgroundColor: "var(--bg-card)",
                border: `1px solid ${isToday ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "8px",
                padding: "6px",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: isToday ? 700 : 400, color: isToday ? "var(--accent)" : "var(--text-muted)", marginBottom: "4px" }}>
                {day}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {dayItems.slice(0, 2).map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: "var(--accent)",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 600,
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </button>
                ))}
                {dayItems.length > 2 && (
                  <p style={{ fontSize: "10px", color: "var(--text-muted)", paddingLeft: "4px" }}>
                    +{dayItems.length - 2} më shumë
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── List View ─────────────────────────────────────────────
function ListView({ items, onUpdate, onDelete, onSelect }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 40px", gap: "12px", padding: "8px 16px", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        <span>Titulli</span>
        <span>Statusi</span>
        <span>Platforma</span>
        <span>Data</span>
        <span></span>
      </div>

      {items.map((item: any) => (
        <ListRow key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} onSelect={onSelect} />
      ))}

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: "14px" }}>
          Nuk ka items në këtë board.
        </div>
      )}
    </div>
  );
}

function ListRow({ item, onUpdate, onDelete, onSelect }: any) {
  const [hovered, setHovered] = useState(false);
  const status = STATUSES.find((s) => s.key === item.status) || STATUSES[0];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(item)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 120px 100px 40px",
        gap: "12px",
        padding: "12px 16px",
        backgroundColor: hovered ? "var(--bg-card)" : "transparent",
        borderRadius: "8px",
        border: "1px solid transparent",
        borderColor: hovered ? "var(--border)" : "transparent",
        cursor: "pointer",
        alignItems: "center",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {item.prompt?.imageUrl && (
          <img src={item.prompt.imageUrl} alt="" style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }} />
        )}
        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.title}
        </span>
      </div>

      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: status.color }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: status.color, display: "inline-block" }} />
        {status.label}
      </span>

      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
        {item.platform || "—"}
      </span>

      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
        {item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString("sq-AL", { day: "numeric", month: "short" }) : "—"}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        style={{ width: "28px", height: "28px", borderRadius: "4px", border: "1px solid var(--border)", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

// ── Item Modal ────────────────────────────────────────────
function ItemModal({ item, onClose, onUpdate, onDelete }: any) {
  const [title, setTitle] = useState(item.title);
  const [status, setStatus] = useState(item.status);
  const [platform, setPlatform] = useState(item.platform || "");
  const [scheduledAt, setScheduledAt] = useState(
    item.scheduledAt ? new Date(item.scheduledAt).toISOString().split("T")[0] : ""
  );
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(item.prompt?.imageUrl || item.customImageUrl || "");
  const [uploading, setUploading] = useState(false);

 const editor = useEditor({
  extensions: [StarterKit],
  content: item.note || "",
  immediatelyRender: false,
  editorProps: {
    attributes: {
      style: "outline: none; min-height: 120px; padding: 12px; font-size: 13px; color: var(--text); font-family: Inter, sans-serif; line-height: 1.6;",
    },
  },
});

  async function uploadImage(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setImageUrl(data.url);
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    await onUpdate({
      title,
      note: editor?.getHTML() || null,
      status,
      platform: platform || null,
      scheduledAt: scheduledAt || null,
    });
    setSaving(false);
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", zIndex: 200 }}
      />
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 201,
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "680px",
        maxHeight: "88vh",
        overflowY: "auto",
        boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
        animation: "modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>

        {/* Image section */}
        <div style={{ position: "relative", width: "100%", height: "260px", backgroundColor: "var(--bg-secondary)", borderRadius: "20px 20px 0 0", overflow: "hidden" }}>
          {imageUrl ? (
            <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Nuk ka imazh</p>
            </div>
          )}

          {/* Upload button overlay */}
          <label style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            padding: "7px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {uploading ? "Duke ngarkuar..." : "Ndrysho imazhin"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
            />
          </label>

          {/* Link to prompt */}
         {item.prompt?.id && (
  <a href={"/prompts/" + item.prompt.id} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", bottom: "12px", left: "12px", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "#fff", fontSize: "12px", fontWeight: 600, padding: "7px 14px", borderRadius: "6px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", border: "1px solid rgba(255,255,255,0.15)" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    Shko te prompt
  </a>
)}
        </div>

        <div style={{ padding: "28px" }}>
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--text)",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          />

          {/* Properties */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "90px", flexShrink: 0 }}>Statusi</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {STATUSES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStatus(s.key)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      border: `1px solid ${status === s.key ? s.color : "var(--border)"}`,
                      backgroundColor: status === s.key ? s.color + "20" : "transparent",
                      color: status === s.key ? s.color : "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "90px", flexShrink: 0 }}>Platforma</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">— Zgjidh —</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Date */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "90px", flexShrink: 0 }}>Data</span>
              <input
                type="date"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          {/* Rich text editor */}
          <div style={{
            border: "1px solid var(--border)",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "24px",
            backgroundColor: "var(--bg-secondary)",
          }}>
            {/* Toolbar */}
            <div style={{
              display: "flex",
              gap: "2px",
              padding: "8px 10px",
              borderBottom: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
            }}>
              {[
                { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold"), title: "Bold" },
                { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic"), title: "Italic" },
                { label: "S", action: () => editor?.chain().focus().toggleStrike().run(), active: editor?.isActive("strike"), title: "Strikethrough" },
              ].map((btn) => (
                <button
                  key={btn.title}
                  onClick={btn.action}
                  title={btn.title}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: btn.active ? "var(--accent)" : "transparent",
                    color: btn.active ? "#fff" : "var(--text-muted)",
                    fontSize: btn.label === "I" ? "14px" : "13px",
                    fontWeight: 700,
                    fontStyle: btn.label === "I" ? "italic" : "normal",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  {btn.label}
                </button>
              ))}

              <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border)", margin: "4px 4px" }} />

              {[
                { label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive("heading", { level: 1 }) },
                { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  style={{
                    padding: "0 8px",
                    height: "28px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: btn.active ? "var(--accent)" : "transparent",
                    color: btn.active ? "#fff" : "var(--text-muted)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {btn.label}
                </button>
              ))}

              <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border)", margin: "4px 4px" }} />

              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: editor?.isActive("bulletList") ? "var(--accent)" : "transparent",
                  color: editor?.isActive("bulletList") ? "#fff" : "var(--text-muted)",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Editor content */}
            <EditorContent editor={editor} />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={onDelete}
              style={{ padding: "9px 18px", borderRadius: "6px", border: "1px solid #ef4444", backgroundColor: "transparent", color: "#ef4444", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Fshi
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={onClose}
                style={{ padding: "9px 18px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}
              >
                Mbyll
              </button>
              <button
                onClick={save}
                disabled={saving}
                style={{ padding: "9px 24px", borderRadius: "6px", border: "none", backgroundColor: "var(--accent)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Duke ruajtur..." : "Ruaj"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .ProseMirror { outline: none; }
        .ProseMirror p { margin: 0 0 8px; }
        .ProseMirror h1 { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
        .ProseMirror h2 { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
        .ProseMirror ul { padding-left: 20px; margin: 0 0 8px; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror s { text-decoration: line-through; }
      `}</style>
    </>
  );
}