"use client";
import { useState } from "react";
import Link from "next/link";
import SaveToBoardModal from "@/components/SaveToBoardModal";
import FilterBar from "@/components/FilterBar";

function PromptCard({ prompt }: { prompt: any }) {
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const isPremium = prompt.tier === "premium";

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          aspectRatio: "3/4",
          backgroundColor: "var(--bg-card)",
          boxShadow: hovered
            ? isPremium
              ? "inset 0 0 0 3px var(--accent)"
              : "inset 0 0 0 3px #ffffff"
            : "inset 0 0 0 1px var(--border)",
          transition: "box-shadow 0.2s ease",
          cursor: "pointer",
        }}
      >
        <Link
          href={`/prompts/${prompt.id}`}
          style={{ display: "block", width: "100%", height: "100%", textDecoration: "none" }}
        >
          {prompt.imageUrl ? (
            <img
              src={prompt.imageUrl}
              alt={prompt.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{prompt.serialCode}</span>
            </div>
          )}
        </Link>

        {isPremium && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              backgroundColor: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            zIndex: 2,
          }}
        >
          <Link
            href={`/prompts/${prompt.id}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#111",
              fontSize: "13px",
              fontWeight: 700,
              padding: "10px 14px",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            {isPremium ? "Personalizoje" : "Merre prompt"}
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBoardModal(true);
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "5px",
              backgroundColor: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "var(--accent)" : "none"}
              stroke={saved ? "var(--accent)" : "#111"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {showBoardModal && (
        <SaveToBoardModal
          promptId={prompt.id}
          promptTitle={prompt.title}
          onClose={() => setShowBoardModal(false)}
        />
      )}
    </>
  );
}

export default function HomepageGrid({
  prompts,
  categories,
}: {
  prompts: any[];
  categories: any[];
}) {
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 100px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto 32px" }}>
        <FilterBar categories={categories} redirectTo="/prompts" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </section>
  );
}