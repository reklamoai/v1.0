import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminPromptsClient from "./client";

export default async function PromptsPage() {
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return <AdminPromptsClient prompts={prompts as any[]} />;
}