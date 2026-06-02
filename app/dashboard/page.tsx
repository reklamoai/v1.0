import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mirësevjen! 👋</h1>
        <p className="text-zinc-400">Logged in si: {session.user?.email}</p>
        <p className="text-zinc-500 text-sm mt-2">
          {(session.user as any)?.isPremium ? "✅ Premium" : "🔒 Free Plan"}
        </p>
      </div>
    </div>
  );
}