import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <AdminSidebar />
      <main style={{
        marginLeft: "200px",
        flex: 1,
        padding: "40px 48px",
        minHeight: "100vh",
      }}>
        {children}
      </main>
    </div>
  );
}