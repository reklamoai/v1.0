import { prisma } from "@/lib/prisma";
import AdminTagsClient from "./client";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
  return <AdminTagsClient tags={tags} />;
}