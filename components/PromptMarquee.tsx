"use client";
import Link from "next/link";
import { useState } from "react";

function MarqueeCard({ prompt, index }: { prompt: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isPremium = prompt.tier === "premium";

  return (
    <div
      style={{
        flexShrink: 0,
        width: "300px",
        borderRadius: "10px",
        padding: "7px 7px 10px",
        backgroundColor: "var(--card-bg-inverse)",
        opacity: 0,
        animation: `fadeInCard 0.4s ease forwards`,
        animationDelay: `${index * 0.06}s`,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: "6px",
          overflow: "hidden",
          aspectRatio: "3/4",
          backgroundColor: "#212121",
          boxShadow: hovered
            ? isPremium
              ? "inset 0 0 0 3px var(--accent)"
              : "inset 0 0 0 3px var(--accent)"
            : "none",
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
              }}
            >
              <span style={{ color: "#666", fontSize: "10px" }}>{prompt.serialCode}</span>
            </div>
          )}
        </Link>

        {isPremium && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              width: "26px",
              height: "26px",
              borderRadius: "5px",
              backgroundColor: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
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
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(5px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            zIndex: 2,
          }}
        >
          <Link
            href={`/prompts/${prompt.id}`}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              color: "#111",
              fontSize: "11px",
              fontWeight: 700,
              padding: "8px 6px",
              borderRadius: "4px",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            {isPremium ? "Personalizoje" : "Merre"}
          </Link>
        </div>
      </div>

      {/* Category label */}
      <div style={{ textAlign: "center", paddingTop: "8px" }}>
        {prompt.category ? (
          <Link
            href={`/prompts?category=${prompt.category.slug}`}
            style={{
              fontSize: "18px",
              fontWeight: 400,
              fontFamily: "'Instrument Serif', serif",
              color: "var(--card-text-inverse)",
              textDecoration: "none",
            }}
          >
            {prompt.category.name}
          </Link>
        ) : (
          <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>—</span>
        )}
      </div>
    </div>
  );
}

export default function PromptMarquee({ prompts }: { prompts: any[] }) {
  const doubled = [...prompts, ...prompts];

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        padding: "0 0 64px",
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          animation: "marquee 40s linear infinite",
          width: "max-content",
          padding: "0 24px",
        }}
      >
        {doubled.map((prompt, i) => (
          <MarqueeCard key={`${prompt.id}-${i}`} prompt={prompt} index={i % prompts.length} />
        ))}
      </div>
    </div>
  );
}