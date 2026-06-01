import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const handler = async (req: NextRequest, { params }: { params: any }) => {
  // Await params if it's a promise (Next.js 15+ convention)
  await params;
  return await NextAuth(req as any, {} as any, authOptions);
};

export { handler as GET, handler as POST };
