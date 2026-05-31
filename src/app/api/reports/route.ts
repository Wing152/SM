export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { targetType, targetId, reason } = await req.json();
    if (!targetType || !targetId || !reason) return NextResponse.json({ message: "All fields required" }, { status: 400 });

    const report = await prisma.report.create({
      data: {
        reporterId: (session.user as any).id,
        targetType,
        targetId,
        reason,
        status: "PENDING"
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Role-based check for ADMIN
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      include: { reporter: { select: { username: true } } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
