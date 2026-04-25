import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const thoughts = await prisma.thought.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  // Basic analytics processing
  const totalThoughts = thoughts.length;
  const avgIntensity = thoughts.reduce((acc, curr) => acc + curr.intensity, 0) / (totalThoughts || 1);

  const emotionCounts: Record<string, number> = {};
  thoughts.forEach(t => {
    emotionCounts[t.emotion] = (emotionCounts[t.emotion] || 0) + 1;
  });

  return NextResponse.json({
    totalThoughts,
    avgIntensity,
    emotionCounts,
    recentTrends: thoughts.slice(-10),
  });
}
