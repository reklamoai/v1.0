import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateSerial(tier: string, count: number) {
  const prefix = tier === "premium" ? "PP" : "FP";
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const num = String(count + 1).padStart(2, "0");
  return `${prefix}_${dd}${mm}_${num}`;
}

export async function POST(req: NextRequest) {
  const { categoryId, tagIds, text, imageUrl, tier, attributes } = await req.json();

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });

  const count = await prisma.prompt.count({ where: { tier } });
  const serialCode = generateSerial(tier, count);

  const prompt = await prisma.prompt.create({
    data: {
      serialCode,
      title: serialCode,
      text,
      tier,
      imageUrl,
      attributes: attributes || null,
      categoryId,
      tags: {
        connectOrCreate: (tagIds || []).map((name: string) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  return NextResponse.json(prompt);
}