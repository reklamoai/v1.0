import { prisma } from "@/lib/prisma";
import AddFreePromptClient from "./client";

export default async function AddFreePromptPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return <AddFreePromptClient categories={categories} tags={tags} />;
}