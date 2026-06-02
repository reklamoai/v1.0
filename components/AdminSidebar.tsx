"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/prompts", label: "Prompts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "200px",
      minHeight: "100vh",
      backgroundColor: "var(--bg-secondary)",
      borderRight: "1px solid var(--border)",
      padding: "32px 0",
      position: "fixed",
      top: "64px",
      left: 0,
      bottom: 0,
    }}>
      <nav style={{ display: "flex", flexDirection: "column" }}>
        {links.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                color: isActive ? "var(--text)" : "var(--text-muted)",
                textDecoration: "none",
                backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}