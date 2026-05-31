import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");
    if (!otherUserId) return NextResponse.json({ message: "UserId required" }, { status: 400 });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: (session.user as any).id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: (session.user as any).id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { username: true, displayName: true } } }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { receiverId, content } = await req.json();
    if (!receiverId || !content) return NextResponse.json({ message: "Receiver and content required" }, { status: 400 });

    const message = await prisma.message.create({
      data: { senderId: (session.user as any).id, receiverId, content },
      include: { sender: { select: { username: true, displayName: true } } }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
