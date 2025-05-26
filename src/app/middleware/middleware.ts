import { middleware } from "./authmiddleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export function authMiddleware(request: NextRequest) {
  console.log("middleware çalıştı");
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};
