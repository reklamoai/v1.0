import { prisma } from "@/lib/prisma";
import AddPremiumPromptClient from "./client";

export default async function AddPremiumPromptPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <AddPremiumPromptClient categories={categories} />;
}