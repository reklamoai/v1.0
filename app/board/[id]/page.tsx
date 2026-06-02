import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import BoardDetailClient from "./client";

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const board = await prisma.board.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: {
        include: { prompt: { include: { category: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!board) notFound();

  return <BoardDetailClient board={board as any} />;
}