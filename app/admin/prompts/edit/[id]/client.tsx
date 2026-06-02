"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AttributeType = "text" | "checkbox" | "dropdown";
type Attribute = { id: string; type: AttributeType; options: string; key: string; label: string };

export default function EditPromptClient({ prompt, categories }: { prompt: any; categories: any[] }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(prompt.categoryId);
  const [selectedTags, setSelectedTags] = useState<string[]>(prompt.tags.map((t: any) => t.name));
  const [text, setText] = useState(prompt.text);
  const [imagePreview, setImagePreview] = useState<string | null>(prompt.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>(
    Array.isArray(prompt.attributes) ? prompt.attributes : []
  );

  function addAttribute() {
    const id = Date.now().toString();
    setAttributes((prev) => [...prev, { id, type: "text", options: "", key: `attr${prev.length + 1}`, label: "" }]);
  }

  function updateAttribute(id: string, field: keyof Attribute, value: string) {
    setAttributes((prev) => prev.map((a) => a.id === id ? { ...a, [field]: value } : a));
  }

  function removeAttribute(id: string) {
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setLoading(true);
    let imageUrl = prompt.imageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      imageUrl = data.url;
    }

    await fetch(`/api/admin/prompts/${prompt.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, tagIds: selectedTags, text, imageUrl, attributes }),
    });

    setLoading(false);
    router.push("/admin/prompts");
  }

  const inputStyle = {
    width: "100%", padding: "10px 16px", borderRadius: "8px",
    border: "1px solid var(--border)", backgroundColor: "var(--bg-card)",
    color: "var(--text)", fontSize: "14px", outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "15px", fontWeight: 600, color: "var(--text)",
    marginBottom: "8px", display: "block",
  };

  const smallInput = {
    padding: "8px 12px", borderRadius: "6px",
    border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)",
    color: "var(--text)", fontSize: "13px", outline: "none",
  };

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text)", marginBottom: "32px" }}>
        Edit {prompt.tier === "premium" ? "Premium" : "Free"} prompt
      </h1>

      {/* Serial Code */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Prompt Serial Code</label>
        <input value={prompt.serialCode} disabled style={{ ...inputStyle, opacity: 0.5 }} />
      </div>

      {/* Category */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Choose Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Tags</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)", minHeight: "44px", alignItems: "center" }}>
          {selectedTags.map((tag) => (
            <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 10px", borderRadius: "999px", backgroundColor: "var(--accent)", color: "white", fontSize: "12px", fontWeight: 500 }}>
              {tag}
              <button onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "14px", lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
          <input
            placeholder={selectedTags.length === 0 ? "product, studio, fashion..." : ""}
            onKeyDown={(e) => {
              if (e.key === "," || e.key === "Enter") {
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim().replace(/,$/, "");
                if (val) { setSelectedTags((prev) => prev.includes(val) ? prev : [...prev, val]); (e.target as HTMLInputElement).value = ""; }
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData("text");
              const newTags = pasted.split(",").map((t) => t.trim()).filter(Boolean);
              setSelectedTags((prev) => { const all = [...prev, ...newTags]; return all.filter((v, i) => all.indexOf(v) === i); });
            }}
            style={{ flex: 1, minWidth: "120px", background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Full Prompt */}
      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Full Prompt</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
      </div>

      {/* Attributes — vetëm për premium */}
      {prompt.tier === "premium" && (
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Attributes</label>
          {attributes.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
              {attributes.map((attr) => (
                <div key={attr.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px 1fr auto", gap: "8px", alignItems: "center", padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <select value={attr.type} onChange={(e) => updateAttribute(attr.id, "type", e.target.value)} style={{ ...smallInput, cursor: "pointer" }}>
                    <option value="text">Text</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="dropdown">Dropdown</option>
                  </select>
                  <input value={attr.options} onChange={(e) => updateAttribute(attr.id, "options", e.target.value)} placeholder={attr.type === "text" ? "Default value" : "Option1, Option2"} style={smallInput} />
                  <input value={attr.key} onChange={(e) => updateAttribute(attr.id, "key", e.target.value)} placeholder="key" style={smallInput} />
                  <input value={attr.label} onChange={(e) => updateAttribute(attr.id, "label", e.target.value)} placeholder="Label për userin" style={smallInput} />
                  <button onClick={() => removeAttribute(attr.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px", padding: "0 4px" }}>×</button>
                </div>
              ))}
            </div>
          )}
          <button onClick={addAttribute} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px dashed var(--border)", backgroundColor: "transparent", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}>
            + ADD NEW
          </button>
        </div>
      )}

      {/* Featured Image */}
      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Featured Image</label>
        {imagePreview ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
            <img src={imagePreview} alt="" style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }} />
            <div>
              <label htmlFor="img-edit" style={{ color: "var(--text)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Change</label>
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}> or </span>
              <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ color: "var(--accent)", fontSize: "13px", background: "none", border: "none", cursor: "pointer" }}>remove</button>
            </div>
          </div>
        ) : (
          <label htmlFor="img-edit" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", borderRadius: "8px", border: "1px dashed var(--border)", backgroundColor: "var(--bg-card)", cursor: "pointer", fontSize: "14px", color: "var(--text-muted)" }}>
            Drag file or browse
          </label>
        )}
        <input id="img-edit" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "var(--accent)", color: "white", fontSize: "15px", fontWeight: 600, border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Duke ruajtur..." : "Save changes"}
      </button>
    </div>
  );
}