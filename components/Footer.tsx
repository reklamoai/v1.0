"use client";
import Link from "next/link";
import { useState } from "react";

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  const style = {
    width: "36px",
    height: "36px",
    borderRadius: "4px",
    border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    color: hovered ? "var(--accent)" : "var(--text-muted)",
    textDecoration: "none" as const,
    transition: "border-color 0.15s, color 0.15s, transform 0.15s",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
  };

  return (
    <a href={href} target={"_blank"} rel={"noopener noreferrer"} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={style}>
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: "13px",
        color: hovered ? "var(--text)" : "var(--text-muted)",
        textDecoration: "none",
        transition: "color 0.15s",
      }}
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      backgroundColor: "var(--bg)",
      padding: "64px 24px 32px",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "48px",
          marginBottom: "64px",
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}>
              reklamo.
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 400,
                color: "var(--accent)",
              }}>
                ai
              </span>
            </div>
            <p style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              maxWidth: "260px",
              marginBottom: "24px",
            }}>
              Bibliotekë me prompts për reklama moderne, të ndara sipas kategorive reale të bizneseve shqiptare.
            </p>

            {/* Social */}
            <div style={{ display: "flex", gap: "12px" }}>
              <SocialLink
                href="https://instagram.com"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                }
              />
              <SocialLink
                href="https://tiktok.com"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                  </svg>
                }
              />
              <SocialLink
                href="https://facebook.com"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                }
              />
            </div>
          </div>

          {/* Platforma */}
          <div>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}>
              Platforma
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <FooterLink href="/prompts" label="Prompts" />
              <FooterLink href="/pse-reklamo" label="Pse reklamo.ai?" />
              <FooterLink href="/ndihme" label="Ndihmë" />
              <FooterLink href="/faq" label="FAQ" />
            </div>
          </div>

          {/* Ligjore */}
          <div>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}>
              Ligjore
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <FooterLink href="/terms" label="Kushtet e përdorimit" />
              <FooterLink href="/privacy" label="Privatësia" />
              <FooterLink href="/refunds" label="Rimbursimet" />
              <FooterLink href="/legal" label="Legal Disclosure" />
            </div>
          </div>

          {/* CTA */}
          <div>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}>
              Fillo tani
            </p>
            <p style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}>
              Merr akses të plotë me një pagesë të vetme.
            </p>
            <Link
              href="/register"
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                display: "inline-block",
                backgroundColor: "var(--accent)",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 700,
                padding: "9px 16px",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "transform 0.15s, box-shadow 0.15s",
                transform: ctaHovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: ctaHovered ? "0 4px 12px rgba(255,85,0,0.35)" : "none",
              }}
            >
              Lifetime-Access: 49.99€ →
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            © 2025 reklamo.ai — Produkt i realizuar nga{" "}
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>NICE</span>
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Made in 🇽🇰
          </p>
        </div>

      </div>

{/* Typo logo */}
<div style={{
  marginTop: "48px",
  overflow: "hidden",
  lineHeight: 0,
}}>
  <img
    src="/reklamoai_typologo.svg"
    alt=""
    style={{
      width: "100%",
      display: "block",
      opacity: 0.10,
      filter: "brightness(0)",
    }}
  />
</div>
    </footer>
  );
}