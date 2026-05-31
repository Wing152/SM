export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: predictionId } = await params;
    const { type } = await req.json();
    if (!["SUPPORT", "OPPOSE"].includes(type)) return NextResponse.json({ message: "Invalid vote type" }, { status: 400 });

    const userId = (session.user as any).id;
    const vote = await prisma.vote.upsert({
      where: { userId_predictionId: { userId, predictionId } },
      update: { type },
      create: { userId, predictionId, type },
    });

    return NextResponse.json(vote);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: predictionId } = await params;
    const userId = (session.user as any).id;
    await prisma.vote.delete({ where: { userId_predictionId: { userId, predictionId } } });

    return NextResponse.json({ message: "Vote removed" });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
