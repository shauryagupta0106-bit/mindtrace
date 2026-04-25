import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thought = await prisma.thought.findUnique({
    where: { id: params.id },
    include: { evidence: true },
  });

  if (!thought || thought.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(thought);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existingThought = await prisma.thought.findUnique({
    where: { id: params.id },
  });

  if (!existingThought || existingThought.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  const body = await req.json();
  const { title, context, emotion, intensity, tags, prediction } = body;

  const thought = await prisma.thought.update({
    where: { id: params.id },
    data: {
      title,
      context,
      emotion,
      intensity: parseInt(intensity),
      tags,
      prediction,
    },
  });

  return NextResponse.json(thought);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existingThought = await prisma.thought.findUnique({
    where: { id: params.id },
  });

  if (!existingThought || existingThought.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  await prisma.evidence.deleteMany({ where: { thoughtId: params.id } });
  await prisma.thought.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
