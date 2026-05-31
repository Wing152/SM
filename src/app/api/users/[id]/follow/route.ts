export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const followerId = (session.user as any).id;
    const { id: followingId } = await params;

    if (followerId === followingId) return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });

    const follow = await prisma.follow.create({
      data: { followerId, followingId },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Already following or error", error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const followerId = (session.user as any).id;
    const { id: followingId } = await params;

    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });

    return NextResponse.json({ message: "Unfollowed" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error unfollowing", error: error.message }, { status: 400 });
  }
}
