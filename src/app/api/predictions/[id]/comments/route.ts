export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: predictionId } = await params;
    const comments = await prisma.comment.findMany({
      where: { predictionId, parentId: null },
      include: {
        user: { select: { username: true, displayName: true, profilePhoto: true, rank: true } },
        replies: {
          include: {
            user: { select: { username: true, displayName: true, profilePhoto: true, rank: true } },
            replies: { include: { user: { select: { username: true } } } }
          }
        },
        _count: { select: { likes: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: predictionId } = await params;
    const { content, parentId } = await req.json();
    if (!content) return NextResponse.json({ message: "Content required" }, { status: 400 });

    const comment = await prisma.comment.create({
      data: {
        content,
        predictionId,
        userId: (session.user as any).id,
        parentId: parentId || null
      },
      include: { user: true }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
