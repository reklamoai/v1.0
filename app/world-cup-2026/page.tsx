import { prisma } from "@/lib/prisma";
import WorldCupClient from "./client";

export const dynamic = "force-dynamic";

export default async function WorldCupPage() {
  const prompts = await prisma.prompt.findMany({
    where: { category: { slug: "world-cup-2026" } },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return <WorldCupClient prompts={prompts as any[]} />;
}