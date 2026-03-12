import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dates = await prisma.dateEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(dates);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const entry = await prisma.dateEntry.create({
    data: { ...body, userId: session.user.id },
  });
  return NextResponse.json(entry);
}
