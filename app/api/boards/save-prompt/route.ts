import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { promptId, boardId } = await req.json();

  // Kontrollo nëse ekziston tashmë
  const existing = await prisma.boardItem.findFirst({
    where: { boardId, promptId },
  });
  if (existing) return NextResponse.json({ ok: true, existing: true });

  const prompt = await prisma.prompt.findUnique({ where: { id: promptId } });
  if (!prompt) return NextResponse.json({ error: "Prompt not found" }, { status: 404 });

  const item = await prisma.boardItem.create({
    data: {
      boardId,
      promptId,
      title: prompt.title,
      status: "idea",
    },
  });

  return NextResponse.json({ ok: true, item });
}