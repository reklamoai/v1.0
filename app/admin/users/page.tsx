import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text)", marginBottom: "32px" }}>Users</h1>

      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        {users.length === 0 ? (
          <p style={{ padding: "24px", color: "var(--text-muted)", fontSize: "14px" }}>Nuk ka users ende.</p>
        ) : (
          users.map((user, i) => (
            <div key={user.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)" }}>
                  {user.email[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "var(--text)", fontWeight: 500 }}>{user.username || user.email.split("@")[0]}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{user.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                  backgroundColor: user.isPremium ? "var(--accent)" : "var(--bg-secondary)",
                  color: user.isPremium ? "white" : "var(--text-muted)",
                }}>
                  {user.isPremium ? "PREMIUM" : "FREE"}
                </span>
                <Link href={`/admin/users/${user.id}`} style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
                  User details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}