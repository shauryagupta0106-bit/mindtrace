import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  // Wipe all thoughts and evidence for the user
  const thoughts = await prisma.thought.findMany({
    where: { userId },
    select: { id: true },
  });

  const thoughtIds = thoughts.map(t => t.id);

  await prisma.evidence.deleteMany({
    where: { thoughtId: { in: thoughtIds } },
  });

  await prisma.thought.deleteMany({
    where: { userId },
  });

  return NextResponse.json({ success: true, message: "Memory wiped successfully" });
}
