export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username, name } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields (email, password, username)" },
        { status: 400 }
      );
    }

    // Wrap DB calls in try-catch for better error reporting
    let existingUser;
    try {
      existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });
    } catch (dbError) {
      console.error("Database check error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please verify DATABASE_URL." },
        { status: 503 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email or username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: name || username,
        displayName: name || username,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration", details: error.message },
      { status: 500 }
    );
  }
}
