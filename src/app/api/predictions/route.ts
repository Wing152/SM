import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { title, explanation, category, confidence, targetDate, tags, visibility, communityId } = await req.json();
    const prediction = await prisma.prediction.create({
      data: {
        title,
        explanation,
        category,
        confidence,
        targetDate: new Date(targetDate),
        tags: Array.isArray(tags) ? tags.join(",") : tags || "",
        visibility: visibility || "PUBLIC",
        userId: (session.user as any).id,
        communityId: communityId || null,
      },
    });
    return NextResponse.json(prediction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const predictions = await prisma.prediction.findMany({
      where: { visibility: "PUBLIC" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(predictions);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
