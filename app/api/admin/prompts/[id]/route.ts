import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.prompt.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { categoryId, tagIds, text, imageUrl, attributes } = await req.json();

  const prompt = await prisma.prompt.update({
    where: { id },
    data: {
      text,
      imageUrl,
      categoryId,
      attributes: attributes || null,
      tags: {
        set: [],
        connectOrCreate: (tagIds || []).map((name: string) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  return NextResponse.json(prompt);
}