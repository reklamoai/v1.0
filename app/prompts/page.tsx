import { prisma } from "@/lib/prisma";
import PromptsPageClient from "./client";

export const dynamic = "force-dynamic";

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; tier?: string; q?: string }>;
}) {
  const params = await searchParams;

  const where: any = {};
  if (params.category) where.category = { slug: params.category };
  if (params.tier) where.tier = params.tier;
  if (params.tag) where.tags = { some: { name: params.tag } };
  if (params.q) where.OR = [
    { title: { contains: params.q, mode: "insensitive" } },
    { text: { contains: params.q, mode: "insensitive" } },
    { tags: { some: { name: { contains: params.q, mode: "insensitive" } } } },
  ];

  const prompts = await prisma.prompt.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 12,
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const total = await prisma.prompt.count({ where });

  return (
    <PromptsPageClient
      prompts={prompts as any[]}
      categories={categories}
      total={total}
      initialParams={params}
    />
  );
}