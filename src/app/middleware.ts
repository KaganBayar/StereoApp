import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add headers to track middleware execution
  response.headers.set("auth-middleware-executed", "true");

  // Protected routes that require authentication
  const protectedPaths = ["/admin", "/dashboard"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // If no tokens at all, redirect to home
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
