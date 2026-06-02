"use client";
import { useState } from "react";
import Link from "next/link";
import SaveToBoardModal from "@/components/SaveToBoardModal";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

function PromptCard({ prompt }: { prompt: any }) {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
          backgroundColor: "#1a1a1a",
          boxShadow: hovered
            ? "inset 0 0 0 3px #FF5500"
            : "inset 0 0 0 1px rgba(255,255,255,0.1)",
          transition: "box-shadow 0.2s ease",
          cursor: "pointer",
        }}
      >
        <Link href={"/prompts/" + prompt.id} style={{ display: "block", width: "100%", height: "100%", textDecoration: "none" }}>
          {prompt.imageUrl ? (
            <img src={prompt.imageUrl} alt={prompt.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a" }}>
              <span style={{ color: "#666", fontSize: "11px" }}>{prompt.serialCode}</span>
            </div>
          )}
        </Link>

        {isPremium && (
          <div style={{ position: "absolute", top: "10px", left: "10px", width: "32px", height: "32px", borderRadius: "6px", backgroundColor: "#FF5500", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, pointerEvents: "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        )}

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px",
          display: "flex", alignItems: "center", gap: "8px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          zIndex: 2,
        }}>
          <Link href={"/prompts/" + prompt.id} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", color: "#111", fontSize: "13px", fontWeight: 700, padding: "10px 14px", borderRadius: "5px", textDecoration: "none" }}>
            {isPremium ? "Personalizoje" : "Merre prompt"}
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
            style={{ width: "40px", height: "40px", borderRadius: "5px", backgroundColor: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>

      {showModal && (
        <SaveToBoardModal promptId={prompt.id} promptTitle={prompt.title} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default function WorldCupClient({ prompts }: { prompts: any[] }) {
  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center" }}>

        {/* Animated background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,85,0,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

        {/* Hero image placeholder */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url('/worldcuphero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>

          <h1 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "24px" }}>
            Reklamo biznesin
            <br />
           <span style={{ color: "#fff", fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>me temë futbolli</span>
          </h1>

          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.6 }}>
            Prompts profesionale të optimizuara për sezonin e madh të futbollit. Çdo biznes mund të reklamojë me stilin e kampionit.
          </p>

          {/* Countdown */}
          <WorldCupCountdown />

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "40px" }}>
            <a href="#prompts" style={{ backgroundColor: "#FF5500", color: "#fff", fontSize: "14px", fontWeight: 700, padding: "12px 28px", borderRadius: "4px", textDecoration: "none" }}>
              Shiko prompts ⚽
            </a>
            <Link href="/register" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "14px", fontWeight: 600, padding: "12px 28px", borderRadius: "4px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              Lifetime Access: 49.99€
            </Link>
          </div>
        </div>
      </section>

   
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
       

        {/* Section header */}
        <div id="prompts" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff" }}>
            {prompts.length} prompts • Kupa e Botës 2026
          </h2>
          <Link href="/prompts?category=world-cup-2026" style={{ fontSize: "13px", color: "#FF5500", textDecoration: "none", fontWeight: 600 }}>
            Shiko të gjitha →
          </Link>
        </div>

        {/* Grid */}
        {prompts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            Prompts po shtohen së shpejti...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </section>

      <PricingSection />
<Footer />
    </div>
  );
}

function WorldCupCountdown() {
  const target = new Date("2026-06-11T00:00:00Z");
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  return (
    <div style={{ display: "inline-flex", gap: "24px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "20px 32px" }}>
      {[
        { value: days, label: "Ditë" },
        { value: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), label: "Orë" },
        { value: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), label: "Min" },
      ].map((item, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <p style={{ fontSize: "40px", fontWeight: 900, color: "#FF5500", lineHeight: 1, letterSpacing: "-0.03em" }}>
            {String(item.value).padStart(2, "0")}
          </p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "4px" }}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}