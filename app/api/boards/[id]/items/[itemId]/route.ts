import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, itemId } = await context.params;
    const data = await req.json();
    if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);
    if (data.scheduledAt === "") data.scheduledAt = null;

    const item = await prisma.boardItem.update({
      where: { id: itemId },
      data,
      include: { prompt: { include: { category: true } } },
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error("PATCH item error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { itemId } = await context.params;
    await prisma.boardItem.delete({ where: { id: itemId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE item error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}