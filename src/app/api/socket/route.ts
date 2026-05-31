import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    message: "WebSockets via Socket.io are not supported in serverless environments like Vercel. Use Pusher or Ably for production real-time updates.",
    supported: false
  }, { status: 200 });
}
