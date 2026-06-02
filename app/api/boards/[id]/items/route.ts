import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const board = await prisma.board.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = await prisma.boardItem.findMany({
    where: { boardId: id },
    include: { prompt: { include: { category: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const board = await prisma.board.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!board) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { promptId, title, note, status, platform, scheduledAt } = await req.json();

  const item = await prisma.boardItem.create({
    data: {
      boardId: id,
      promptId: promptId || null,
      title: title || "Pa titull",
      note: note || null,
      status: status || "idea",
      platform: platform || null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
    include: { prompt: { include: { category: true } } },
  });

  return NextResponse.json(item);
}