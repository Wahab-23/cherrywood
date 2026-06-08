import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { DASHBOARD_ROLES, STOREFRONT_ROLES } from "@/lib/constants/roles";

function createJsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function shouldProtectPath(pathname: string) {
  // Don't protect login pages
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return false;
  }

  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/storefront" ||
    pathname.startsWith("/storefront/")
  );
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!shouldProtectPath(pathname)) {
    return NextResponse.next();
  }

  const session = getSession(request);
  if (!session) {
    // For page routes, allow to load - client-side will handle redirect
    // For API routes, return error
    if (pathname.startsWith("/api/")) {
      return createJsonError("Unauthorized. Please log in.", 401);
    }
    return NextResponse.next();
  }

  if (!session.isVerified) {
    if (pathname.startsWith("/api/")) {
      return createJsonError("Access denied. Please verify your account.", 403);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    if (!DASHBOARD_ROLES.has(session.roleName)) {
      if (pathname.startsWith("/api/")) {
        return createJsonError(
          "Forbidden. Your role cannot access this dashboard area.",
          403
        );
      }
      return NextResponse.next();
    }
  }

  if (pathname.startsWith("/storefront")) {
    if (!STOREFRONT_ROLES.has(session.roleName)) {
      if (pathname.startsWith("/api/")) {
        return createJsonError(
          "Forbidden. Your role cannot access this storefront area.",
          403
        );
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/storefront/:path*", "/api/:path*"],
};
