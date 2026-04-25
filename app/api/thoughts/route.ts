import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thoughts = await prisma.thought.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { evidence: true },
  });

  return NextResponse.json(thoughts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, context, emotion, intensity, tags, prediction, evidence } = body;

  const thought = await prisma.thought.create({
    data: {
      title,
      context,
      emotion,
      intensity: parseInt(intensity),
      tags,
      prediction,
      userId: (session.user as any).id,
      evidence: {
        create: evidence?.map((e: any) => ({
          url: e.url,
          type: e.type,
        })),
      },
    },
  });

  return NextResponse.json(thought);
}
