"use client";
import Link from "next/link";
import { useState } from "react";

export default function HeroButtons() {
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "56px" }}>
      <Link
        href="/register"
        onMouseEnter={() => setHoverPrimary(true)}
        onMouseLeave={() => setHoverPrimary(false)}
        style={{
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          padding: "10px 20px",
          borderRadius: "4px",
          textDecoration: "none",
          display: "inline-block",
          transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
          transform: hoverPrimary ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hoverPrimary ? "0 4px 12px rgba(255,85,0,0.4)" : "none",
          backgroundColor: hoverPrimary ? "var(--accent-hover)" : "var(--accent)",
        } as any}
      >
        Lifetime-Access: 49.99€
      </Link>
      <Link
        href="/prompts"
        onMouseEnter={() => setHoverSecondary(true)}
        onMouseLeave={() => setHoverSecondary(false)}
        style={{
          backgroundColor: "transparent",
          color: hoverSecondary ? "var(--accent)" : "var(--text)",
          fontSize: "13px",
          fontWeight: 600,
          padding: "10px 20px",
          borderRadius: "4px",
          textDecoration: "none",
          display: "inline-block",
          border: hoverSecondary ? "1px solid var(--accent)" : "1px solid var(--border)",
          transition: "transform 0.15s ease, border-color 0.15s ease, color 0.15s ease",
          transform: hoverSecondary ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        50+ prompts falas
      </Link>
    </div>
  );
}