import { prisma } from "@/lib/prisma";
import AdminCategoriesClient from "./client";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <AdminCategoriesClient categories={categories} />;
}