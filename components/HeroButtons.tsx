"use client";
import Link from "next/link";

export default function HeroButtons() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "clamp(40px, 7vw, 56px)",
      }}
    >
      <Link href="/register" className="btn-primary">
        Lifetime-Access: 49.99€
      </Link>
      <Link href="/prompts" className="btn-secondary">
        50+ prompts falas
      </Link>
    </div>
  );
}
