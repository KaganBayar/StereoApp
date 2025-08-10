/*import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { cookies } from "next/headers";

const protectedRoutes = ["/admin"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("accessToken")?.value;
  if (cookie) {
    const session = await jwtDecrypt(
      cookie,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session?.userId) {
      return NextResponse.redirect(new URL("/", req.nextUrl)); //bunu değiştir
    }
    return NextResponse.next();
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
/*