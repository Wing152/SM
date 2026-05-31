import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ users: [], predictions: [], communities: [] });
    }

    // Fuzzy search (using contains for SQLite)
    const [users, predictions, communities] = await Promise.all([
      prisma.user.findMany({
        where: { OR: [{ username: { contains: q } }, { displayName: { contains: q } }] },
        select: { id: true, username: true, displayName: true, profilePhoto: true, trustScore: true },
        take: 5
      }),
      prisma.prediction.findMany({
        where: { title: { contains: q }, visibility: "PUBLIC" },
        include: { user: { select: { username: true } } },
        take: 5
      }),
      prisma.community.findMany({
        where: { name: { contains: q } },
        take: 5
      })
    ]);

    return NextResponse.json({ users, predictions, communities });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
