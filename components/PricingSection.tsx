"use client";
import Link from "next/link";
import { useState } from "react";

const CHECK = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="7" fill="#22c55e" fillOpacity="0.15"/>
    <path d="M4 7l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CROSS = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="7" fill="#ef4444" fillOpacity="0.1"/>
    <path d="M5 5l4 4M9 5l-4 4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const features = [
  { text: "Qasje në Free Prompts", free: true },
  { text: "Kategori për biznese të ndryshme", free: true },
  { text: "Qasje në Premium Prompts", free: false },
  { text: "Prompt customizer", free: false },
  { text: "Free updates", free: false },
  { text: "Founder benefits për produktet e ardhshme", free: false },
];

export default function PricingSection() {
  const [hovered, setHovered] = useState(false);

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "var(--bg)" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Title */}
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 800,
          color: "var(--text)",
          marginBottom: "56px",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}>
          Akses{" "}
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "normal",
            fontWeight: 400,
            color: "var(--accent)",
          }}>
            i përhershëm!
          </span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }}>

          {/* Standard — Free */}
          <div style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "32px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
              Standard
            </p>

            <div style={{ marginBottom: "4px" }}>
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "56px",
                color: "var(--text)",
                lineHeight: 1,
              }}>
                0€
              </span>
            </div>
            <p style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "15px",
              color: "var(--text-muted)",
              marginBottom: "32px",
            }}>
              përgjithmonë
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: f.free ? "var(--text)" : "var(--text-muted)",
                }}>
                  {f.free ? <CHECK /> : <CROSS />}
                  {f.text}
                </div>
              ))}
            </div>

            <button disabled style={{
              width: "100%",
              padding: "11px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              cursor: "not-allowed",
              opacity: 0.6,
            }}>
              Plan i aktivizuar
            </button>
          </div>

          {/* Lifetime */}
          <div style={{
            backgroundColor: "var(--accent)",
            borderRadius: "8px",
            padding: "32px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* subtle top shine */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.3)",
            }} />

            <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
              Founder Lifetime Access
            </p>

            <div style={{ marginBottom: "4px" }}>
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "56px",
                color: "#fff",
                lineHeight: 1,
              }}>
                49.99€
              </span>
            </div>
            <p style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "15px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "32px",
            }}>
              një herë
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#fff",
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="rgba(255,255,255,0.2)"/>
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f.text}
                </div>
              ))}
            </div>

            <Link
              href="/checkout"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 700,
                backgroundColor: "#fff",
                color: "var(--accent)",
                textAlign: "center",
                textDecoration: "none",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hovered ? "0 6px 20px rgba(0,0,0,0.15)" : "none",
              }}
            >
              Merr aksesin tani →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}