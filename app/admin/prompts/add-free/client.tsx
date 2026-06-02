"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddFreePromptClient({ categories, tags }: { categories: any[]; tags: any[] }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handlePublish() {
    if (!categoryId || !text.trim()) return;
    setLoading(true);

    let imageUrl = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      imageUrl = data.url;
    }

    await fetch("/api/admin/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, tagIds: selectedTags, text, imageUrl, tier: "free" }),
    });

    setLoading(false);
    router.push("/admin/prompts");
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg-card)",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "8px",
    display: "block",
  };

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text)", marginBottom: "32px" }}>
        Add Free prompt
      </h1>

      {/* Serial Code */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Prompt Serial Code</label>
        <input value="Auto-generated" disabled style={{ ...inputStyle, opacity: 0.5 }} />
      </div>

      {/* Category */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Choose Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Tags</label>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg-card)",
          minHeight: "44px",
          alignItems: "center",
        }}>
          {selectedTags.map((tag) => (
            <span key={tag} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 10px",
              borderRadius: "999px",
              backgroundColor: "var(--accent)",
              color: "white",
              fontSize: "12px",
              fontWeight: 500,
            }}>
              {tag}
              <button
                onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "14px", lineHeight: 1, padding: 0 }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            placeholder={selectedTags.length === 0 ? "product, studio, fashion..." : ""}
            onKeyDown={(e) => {
              if (e.key === "," || e.key === "Enter") {
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim().replace(/,$/, "");
                if (val) {
                  setSelectedTags((prev) => prev.includes(val) ? prev : [...prev, val]);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData("text");
              const newTags = pasted.split(",").map((t) => t.trim()).filter(Boolean);
              setSelectedTags((prev) => {
                const all = [...prev, ...newTags];
                return all.filter((v, i) => all.indexOf(v) === i);
              });
            }}
            style={{
              flex: 1,
              minWidth: "120px",
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontSize: "14px",
            }}
          />
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
          Shtyp presje ose Enter për të shtuar. Paste me presje shton të gjitha njëherësh.
        </p>
      </div>

      {/* Full Prompt */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Full Prompt</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          placeholder="Shkruaj promptin e plotë këtu..."
        />
      </div>

      {/* Featured Image */}
      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Featured Image</label>
        {imagePreview ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
            <img src={imagePreview} alt="" style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }} />
            <div>
              <label htmlFor="img-upload" style={{ color: "var(--text)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Change</label>
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}> or </span>
              <button
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                style={{ color: "var(--accent)", fontSize: "13px", background: "none", border: "none", cursor: "pointer" }}
              >
                remove
              </button>
            </div>
          </div>
        ) : (
          <label htmlFor="img-upload" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", borderRadius: "8px", border: "1px dashed var(--border)", backgroundColor: "var(--bg-card)", cursor: "pointer", fontSize: "14px", color: "var(--text-muted)" }}>
            Drag file or browse
          </label>
        )}
        <input id="img-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
      </div>

      {/* Publish */}
      <button
        onClick={handlePublish}
        disabled={loading}
        style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "var(--accent)", color: "white", fontSize: "15px", fontWeight: 600, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Duke publikuar..." : "Publish"}
      </button>
    </div>
  );
}