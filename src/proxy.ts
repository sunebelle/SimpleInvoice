import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_EXPIRED_REASON } from "@/features/auth/constants/session";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const orgToken = request.cookies.get("org_token")?.value;
  const isLoggedIn = !!(accessToken && orgToken);

  const { pathname } = request.nextUrl;
  const sessionExpiredReason =
    request.nextUrl.searchParams.get("reason") === SESSION_EXPIRED_REASON;

  // Session hết hạn: xóa cookie stale trên response (proxy/middleware được phép mutate cookie)
  if (pathname === "/login" && sessionExpiredReason && isLoggedIn) {
    const response = NextResponse.next();
    response.cookies.delete("access_token");
    response.cookies.delete("org_token");
    return response;
  }

  // 1. Đã đăng nhập nhưng truy cập /login -> Redirect về trang chủ /
  // Trừ khi session vừa hết hạn (cookie stale chưa kịp xóa trên browser)
  if (isLoggedIn && pathname === "/login") {
    if (!sessionExpiredReason) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Các API routes public không cần check auth
  const isPublicApi = pathname === "/api/auth/login";

  // 2. Chưa đăng nhập
  if (!isLoggedIn) {
    // Nếu gọi API -> Trả về JSON 401 Unauthorized
    if (pathname.startsWith("/api/") && !isPublicApi) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    // Nếu là truy cập trang giao diện (không phải files static) -> Redirect về /login
    const isStaticAsset =
      pathname.startsWith("/_next/") ||
      pathname.includes(".") ||
      pathname === "/favicon.ico";

    if (
      pathname !== "/login" &&
      !pathname.startsWith("/api/") &&
      !isStaticAsset
    ) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname); // Giữ lại trang đích để redirect sau khi login
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Chạy proxy trên tất cả các request, ngoại trừ static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
