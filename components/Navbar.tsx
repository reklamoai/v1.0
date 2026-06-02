"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import * as motion from "motion/react-client";
import gsap from "gsap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        backgroundColor: isDark ? "#2a2a2a" : "#e0e0e0",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: "2px",
        justifyContent: isDark ? "flex-end" : "flex-start",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <motion.div
        layout
        transition={{ type: "spring", visualDuration: 0.2, bounce: 0.25 }}
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: isDark ? "var(--accent)" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}
      >
        {isDark ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        )}
      </motion.div>
    </button>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // GSAP animation
  useEffect(() => {
    if (!menuRef.current) return;
    const el = menuRef.current;
    const items = el.querySelectorAll(".menu-item");

    if (menuOpen) {
      gsap.killTweensOf([el, items]);
      gsap.fromTo(el,
        { opacity: 0, y: -12, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
      );
      gsap.fromTo(items,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", stagger: 0.05, delay: 0.06 }
      );
    } else {
      gsap.killTweensOf([el, items]);
      gsap.to(el, {
        opacity: 0,
        y: -8,
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [menuOpen]);

  const username = session?.user?.email?.split("@")[0];
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Floating navbar */}
      <div style={{
        position: "fixed",
        top: "16px",
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "clamp(8px, 2vw, 12px)",
        padding: "0 clamp(12px, 4vw, 28px)",
      }}>

       <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 12px)", minWidth: 0 }}>
        {/* Logo pill */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--nav-glass)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid var(--nav-border)",
            boxShadow: "var(--nav-shadow)",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src="/reklamoai-roundsymbol.svg"
            alt="Reklamo.ai"
            width={28}
            height={28}
          />
        </Link>

        {/* Menu pill */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "56px",
              padding: "0 24px",
              borderRadius: "28px",
              backgroundColor: "var(--nav-glass)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid var(--nav-border)",
              boxShadow: "var(--nav-shadow)",
              cursor: "pointer",
              color: "var(--text)",
              fontSize: "15px",
              fontWeight: 600,
              transition: "background-color 0.2s",
            }}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
              </svg>
            )}
            <span className="hide-xs">Menu</span>
          </button>

          {/* Mega menu — gjithmonë në DOM, GSAP kontrollon visibility */}
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid var(--border)",
              borderRadius: "22px",
              padding: "10px",
              width: "min(92vw, 340px)",
              maxHeight: "min(78vh, 640px)",
              overflowY: "auto",
              boxShadow: "0 24px 64px rgba(10,10,10,0.18)",
              pointerEvents: menuOpen ? "all" : "none",
              opacity: 0,
            }}
          >
            {/* Main links */}
            {[
              { href: "/world-cup-2026", label: "World Cup 2026", sub: "⚽" },
              { href: "/prompts", label: "Prompts", sub: "Të gjitha" },
              { href: "/prompts?tier=free", label: "Falas", sub: "50+ falas" },
              { href: "/prompts?tier=premium", label: "Premium", sub: "Premium" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="menu-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 16px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  color: "var(--text)",
                  transition: "background 0.18s var(--ease)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--menu-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <span style={{ fontSize: "clamp(1.25rem, 1rem + 1vw, 1.5rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>{item.label}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.sub}</span>
              </Link>
            ))}

            <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "6px 8px" }} />

            {/* Categories */}
            <div className="menu-item" style={{ padding: "8px 12px 6px" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-muted)", marginBottom: "10px" }}>
                Kategoritë
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/prompts?category=${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      padding: "8px 14px",
                      borderRadius: "20px",
                      border: "1px solid var(--border)",
                      transition: "all 0.18s var(--ease)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.backgroundColor = "var(--accent-soft)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
       </div>

        {/* Right pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "56px",
          flexShrink: 0,
          padding: "0 16px",
          borderRadius: "28px",
          backgroundColor: "var(--nav-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--nav-border)",
          boxShadow: "var(--nav-shadow)",
        }}>
          <ThemeToggle />

          <div style={{ width: "1px", height: "20px", backgroundColor: "var(--nav-border)" }} />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "4px",
                }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#fff",
                  }}>
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hide-xs">Llogaria</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" style={{ minWidth: "220px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "6px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                <DropdownMenuLabel>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Hej,</p>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)" }}>{username}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {[
                    { href: "/dashboard", label: "Dashboard", icon: "⊞" },
                    { href: "/dashboard/saved", label: "Prompts të ruajtura", icon: "♡" },
                    { href: "/dashboard/settings", label: "Cilësimet", icon: "⚙" },
                  ].map((item) => (
                    <DropdownMenuItem key={item.href}>
                      <Link href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "6px", textDecoration: "none", color: "var(--text)", fontSize: "13px", fontWeight: 500 }}>
                        <span style={{ color: "var(--text-muted)", width: "16px" }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "6px", textDecoration: "none", color: "var(--accent)", fontSize: "13px", fontWeight: 600 }}>
                        <span style={{ width: "16px" }}>◈</span>
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => signOut()} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", color: "#ef4444" }}>
                  <span style={{ width: "16px" }}>→</span>
                  Dil nga llogaria
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link href="/login" style={{ color: "var(--text-muted)", fontSize: "14px", textDecoration: "none", fontWeight: 500, padding: "4px 8px" }}>
                Hyr
              </Link>
              <Link href="/register" style={{ backgroundColor: "var(--accent)", color: "#fff", fontSize: "13px", fontWeight: 700, padding: "8px 16px", borderRadius: "20px", textDecoration: "none" }}>
                Regjistrohu
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}