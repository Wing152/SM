import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateNewReputation } from "@/lib/reputation";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status } = await req.json();
    if (!["CORRECT", "INCORRECT"].includes(status)) return NextResponse.json({ message: "Invalid status" }, { status: 400 });

    const prediction = await prisma.prediction.findUnique({ where: { id }, include: { user: true } });
    if (!prediction) return NextResponse.json({ message: "Prediction not found" }, { status: 404 });

    // Only the prediction creator or an admin can resolve it
    if (prediction.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (prediction.status !== "PENDING") return NextResponse.json({ message: "Already resolved" }, { status: 400 });

    const updatedPrediction = await prisma.prediction.update({ where: { id }, data: { status } });
    const user = prediction.user;
    const newRep = calculateNewReputation({
      predictionCount: user.predictionCount,
      correctPredictions: user.correctPredictions,
      incorrectPredictions: user.incorrectPredictions,
      accuracyRate: user.accuracyRate,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      trustScore: user.trustScore,
      rank: user.rank as any,
    }, status === "CORRECT", prediction.confidence);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        correctPredictions: newRep.correctPredictions,
        incorrectPredictions: newRep.incorrectPredictions,
        accuracyRate: newRep.accuracyRate,
        currentStreak: newRep.currentStreak,
        longestStreak: newRep.longestStreak,
        trustScore: newRep.trustScore,
        rank: newRep.rank,
      },
    });

    return NextResponse.json(updatedPrediction);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
