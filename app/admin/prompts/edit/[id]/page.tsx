import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPromptClient from "./client";

export default async function EditPromptPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: { tags: true, category: true },
  });

  if (!prompt) notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return <EditPromptClient prompt={prompt as any} categories={categories} />;
}