"use client";
import { useRouter } from "next/navigation";

export default function UserDetailsClient({ user }: { user: any }) {
  const router = useRouter();

  async function handleBan() {
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned: !user.banned }),
    });
    router.refresh();
  }

  async function handleTogglePremium() {
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPremium: !user.isPremium }),
    });
    router.refresh();
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text)", marginBottom: "32px" }}>User Details</h1>

      {/* Info */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
        {[
          { label: "Username", value: user.username || "—" },
          { label: "Full name", value: user.fullName || "—" },
          { label: "E-mail", value: user.email },
          { label: "Account Type", value: user.isPremium ? "PREMIUM" : "FREE" },
          { label: "Banned", value: user.banned ? "Yes" : "No" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.label}</span>
            <span style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "12px" }}>Activity Log</h2>
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          {user.usages.length === 0 ? (
            <p style={{ padding: "16px", fontSize: "13px", color: "var(--text-muted)" }}>Nuk ka aktivitet ende.</p>
          ) : (
            user.usages.map((u: any, i: number) => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < user.usages.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "13px", color: "var(--text)" }}>{u.type}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>Security</h2>
        <button
          onClick={handleTogglePremium}
          style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text)", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
        >
          {user.isPremium ? "Hiq Premium access" : "Shto Premium access"}
        </button>
        <button
          onClick={handleBan}
          style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #ef4444", backgroundColor: "transparent", color: "#ef4444", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
        >
          {user.banned ? "Unban user" : "Ban user permanently"}
        </button>
      </div>
    </div>
  );
}