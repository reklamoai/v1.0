import { prisma } from "@/lib/prisma";

export default async function AdminOverview() {
  const [totalPrompts, totalUsages, totalSales, subscribers] = await Promise.all([
    prisma.prompt.count(),
    prisma.promptUsage.count(),
    prisma.purchase.aggregate({ _sum: { amount: true }, where: { status: "completed" } }),
    prisma.user.count({ where: { isPremium: true } }),
  ]);

  const topCategories = await prisma.category.findMany({
    take: 5,
    include: {
      _count: { select: { prompts: true } },
    },
    orderBy: { prompts: { _count: "desc" } },
  });

  const stats = [
    { label: "Total Prompts", value: totalPrompts.toString() },
    { label: "Copied / Used", value: totalUsages.toLocaleString() },
    { label: "Total Sales", value: `€${(totalSales._sum.amount || 0).toLocaleString()}` },
    { label: "Subscribers", value: subscribers.toString() },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text)", marginBottom: "32px" }}>
        Overview
      </h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>{stat.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--text)" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Top Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>Top Categories</h2>
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {topCategories.map((cat, i) => (
              <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: i < topCategories.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "14px", color: "var(--text)" }}>{cat.name}</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{cat._count.prompts} prompts</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>Top Plan</h2>
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {[
              { label: "Standard", value: `${(await prisma.user.count({ where: { isPremium: false } })).toLocaleString()} users` },
              { label: "Premium", value: `${subscribers.toLocaleString()} users` },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: i === 0 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.label}</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}