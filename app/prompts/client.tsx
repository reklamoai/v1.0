"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AIWordCycler from "@/components/AIWordCycler";
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
              <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                {prompt.serialCode}
              </span>
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
              letterSpacing: "-0.01em",
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
            title="Ruaj"
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

export default function PromptsPageClient({
  prompts: initialPrompts,
  categories,
  total,
  initialParams,
}: {
  prompts: any[];
  categories: any[];
  total: number;
  initialParams: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [prompts, setPrompts] = useState(initialPrompts);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(12);

  function buildQuery(overrides: any = {}) {
    const params = new URLSearchParams();
    if (overrides.category) params.set("category", overrides.category);
    if (overrides.tier) params.set("tier", overrides.tier);
    if (overrides.q) params.set("q", overrides.q);
    return params.toString();
  }

  async function loadMore() {
    setLoading(true);
    const qs = buildQuery({
      category: initialParams.category,
      tier: initialParams.tier,
      q: initialParams.q,
    });
    const res = await fetch(`/api/prompts?${qs}&skip=${skip}&take=12`);
    const data = await res.json();
    setPrompts((prev) => [...prev, ...data]);
    setSkip((prev) => prev + 12);
    setLoading(false);
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div className="grid-bg" />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: "12px",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Reklamo me <AIWordCycler />
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Bibliotekë me prompts për reklama moderne, të ndara sipas kategorive reale të bizneseve.
          </p>
        </div>

        {/* Filter bar */}
        <div style={{ maxWidth: "860px", margin: "0 auto 48px" }}>
          <FilterBar
            categories={categories}
            initialCategory={initialParams.category || ""}
            initialTier={initialParams.tier || ""}
            initialQ={initialParams.q || ""}
            onFilter={({ category, tier, q }) => {
              const params = new URLSearchParams();
              if (category) params.set("category", category);
              if (tier) params.set("tier", tier);
              if (q) params.set("q", q);
              const qs = params.toString();
              router.push(`${pathname}${qs ? `?${qs}` : ""}`);
            }}
          />
        </div>

        {/* Grid */}
        {prompts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Nuk ka prompts për këtë filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}

        {/* Load more */}
        {skip < total + 12 && prompts.length >= 12 && (
          <div style={{ marginTop: "16px" }}>
            <button
              onClick={loadMore}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Duke ngarkuar..." : "Shfaq më shumë"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}