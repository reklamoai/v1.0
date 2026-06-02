import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const slug = slugify(name);

  const category = await prisma.category.create({
    data: { name, slug },
  });

  return NextResponse.json(category);
}