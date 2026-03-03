import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("luna_auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Route Categories
  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isRoot = pathname === "/";

  // 2. LOGIC: Unauthorized user trying to access Dashboard
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. LOGIC: Logged-in user trying to access Login/Verify (or Root)
  if (token && (isAuthRoute || isRoot)) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  // 4. LOGIC: Redirect root to login if no token
  if (!token && isRoot) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Ensure the middleware runs on your specific folders
export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
};
