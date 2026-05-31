export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = 10;

    const predictions = await prisma.prediction.findMany({
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      where: { visibility: "PUBLIC" },
      include: {
        user: { select: { username: true, displayName: true, profilePhoto: true, trustScore: true, rank: true } },
        _count: { select: { votes: true, comments: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    let nextCursor: string | undefined = undefined;
    if (predictions.length > limit) {
      const nextItem = predictions.pop();
      nextCursor = nextItem!.id;
    }

    const ranked = predictions.map((p: any) => {
      const score = (p.user.trustScore * 0.2) + ((p._count.votes + p._count.comments) * 0.8);
      return { ...p, score };
    }).sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json({
      items: ranked,
      nextCursor
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
