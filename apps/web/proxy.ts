import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookieName = process.env.SESSION_COOKIE_NAME;

  if (!sessionCookieName) {
    throw new Error("缺少 SESSION_COOKIE_NAME 环境变量!");
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!request.cookies.has(sessionCookieName)) {
    const url = request.nextUrl.clone();

    url.pathname = "/admin/login";
    url.search = "";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
