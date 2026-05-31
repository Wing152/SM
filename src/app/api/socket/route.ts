import { Server as ServerIO } from "socket.io";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const res = (req as any).res;
  if (res?.socket?.server?.io) {
    return new Response("Socket is already running", { status: 200 });
  }

  const io = new ServerIO(res.socket.server as any, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  return new Response("Socket initialized", { status: 200 });
}
