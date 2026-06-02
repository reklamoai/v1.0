import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserDetailsClient from "./client";

export default async function UserDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { purchases: true, usages: { orderBy: { createdAt: "desc" }, take: 20 } },
  });

  if (!user) notFound();

  return <UserDetailsClient user={user as any} />;
}