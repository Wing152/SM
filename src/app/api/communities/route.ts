import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const communities = await prisma.community.findMany({
      include: { _count: { select: { members: true, predictions: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(communities);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, description, rules, image } = await req.json();
    if (!name) return NextResponse.json({ message: "Name required" }, { status: 400 });

    const community = await prisma.community.create({
      data: {
        name,
        description,
        rules,
        image,
        moderatorId: (session.user as any).id,
        members: {
          create: { userId: (session.user as any).id, role: "ADMIN" }
        }
      }
    });

    return NextResponse.json(community, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Community already exists or error", error: error.message }, { status: 400 });
  }
}
