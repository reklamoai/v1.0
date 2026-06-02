import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const tier = searchParams.get("tier");
  const q = searchParams.get("q");
  const tag = searchParams.get("tag");
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "12");

  const where: any = {};
  if (category) where.category = { slug: category };
  if (tier) where.tier = tier;
  if (tag) where.tags = { some: { name: tag } };
  if (q) where.OR = [
    { title: { contains: q, mode: "insensitive" } },
    { text: { contains: q, mode: "insensitive" } },
    { tags: { some: { name: { contains: q, mode: "insensitive" } } } },
  ];

  const prompts = await prisma.prompt.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true },
    skip,
    take,
  });

  return NextResponse.json(prompts);
}