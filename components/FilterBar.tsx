"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterBarProps {
  categories: Category[];
  initialCategory?: string;
  initialTier?: string;
  initialQ?: string;
  onFilter?: (params: { category: string; tier: string; q: string }) => void;
  redirectTo?: string; // nëse dëshiron redirect te /prompts
}

export default function FilterBar({
  categories,
  initialCategory = "",
  initialTier = "",
  initialQ = "",
  onFilter,
  redirectTo,
}: FilterBarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [tier, setTier] = useState(initialTier);
  const [q, setQ] = useState(initialQ);

  const selectedCategory = categories.find((c) => c.slug === category);

  function apply(overrides: any = {}) {
    const p = { category, tier, q, ...overrides };
    if (onFilter) {
      onFilter(p);
    } else if (redirectTo) {
      const params = new URLSearchParams();
      if (p.category) params.set("category", p.category);
      if (p.tier) params.set("tier", p.tier);
      if (p.q) params.set("q", p.q);
      const qs = params.toString();
      router.push(`${redirectTo}${qs ? `?${qs}` : ""}`);
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          height: "56px",
          position: "relative",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* Dropdown */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 20px",
              height: "56px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              color: "#111",
              whiteSpace: "nowrap",
            }}
          >
            {selectedCategory ? selectedCategory.name : "Te gjitha kategorite"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
                color: "#666",
              }}
            >
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                minWidth: "200px",
                zIndex: 100,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                animation: "dropdownIn 0.15s ease",
              }}
            >
              {[{ id: "", slug: "", name: "Te gjitha kategorite" }, ...categories].map((cat, i) => (
                <button
                  key={cat.id || "all"}
                  onClick={() => {
                    setCategory(cat.slug);
                    apply({ category: cat.slug });
                    setDropdownOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "11px 16px",
                    background: category === cat.slug ? "var(--accent)" : "none",
                    border: "none",
                    borderTop: i > 0 ? "1px solid #f3f4f6" : "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: category === cat.slug ? 700 : 400,
                    color: category === cat.slug ? "#fff" : "#111",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: "1px", height: "24px", backgroundColor: "#e5e7eb", flexShrink: 0 }} />

        {/* Search */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "0 20px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply({ q })}
            placeholder="Keyword"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "#111",
              backgroundColor: "transparent",
            }}
          />
        </div>

        <div style={{ width: "1px", height: "24px", backgroundColor: "#e5e7eb", flexShrink: 0 }} />

        {/* Tier */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "0 20px", flexShrink: 0 }}>
          {["free", "premium"].map((t) => (
            <button
              key={t}
              onClick={() => {
                const next = tier === t ? "" : t;
                setTier(next);
                apply({ tier: next });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: "#111",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "5px",
                  border: "2px solid var(--accent)",
                  backgroundColor: tier === t ? "var(--accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background-color 0.1s",
                }}
              >
                {tier === t && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {t === "free" ? "Falas" : "Premium"}
            </button>
          ))}
        </div>
      </div>

      {dropdownOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </>
  );
}