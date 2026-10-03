import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Cổng duy nhất của site: chặn `/internal/**`.
 *
 * Endpoint registry riêng (`/r/internal/*.json`) KHÔNG gác ở đây — nó dùng
 * `Authorization: Bearer`, không dùng cookie, và phải trả 401 cho CLI thay vì
 * redirect sang trang đăng nhập. Route handler tự kiểm.
 */

const SKIP_PREFIXES = ["/_next", "/api", "/images", "/scripts"];

/**
 * Đuôi file tĩnh trong `public/`. Chỉ những đuôi này được bỏ qua cổng — không
 * loại theo "có dấu chấm", vì slug hợp lệ như `/components/data-table.v2` cũng
 * chứa dấu chấm và sẽ thoát khỏi proxy.
 */
const STATIC_FILE_EXTENSIONS = [
  ".ico", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif",
  ".css", ".js", ".map", ".json", ".txt", ".xml", ".webmanifest",
  ".woff", ".woff2", ".ttf", ".otf", ".eot", ".pdf", ".mp4", ".webm",
];

function shouldBypassGate(pathname: string): boolean {
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  const lower = pathname.toLowerCase();
  return STATIC_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypassGate(pathname)) return NextResponse.next();
  if (pathname !== "/internal" && !pathname.startsWith("/internal/")) return NextResponse.next();

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);

  const response = NextResponse.redirect(loginUrl);
  // Cookie hết hạn hoặc sai chữ ký thì xoá luôn, tránh vòng lặp redirect khi
  // trình duyệt cứ gửi lại đúng cookie hỏng đó.
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

export const config = {
  // Neo `/` sau mỗi tiền tố để không loại nhầm `/apiary`, `/imagestore`…
  // Không dùng `.*\..*`: mẫu đó loại MỌI path chứa dấu chấm khỏi proxy, nên
  // một slug có dấu chấm sẽ thoát hoàn toàn khỏi cổng. File tĩnh được lọc
  // trong `shouldBypassGate` bằng danh sách đuôi.
  matcher: ["/((?!api/|_next/static/|_next/image/|favicon\\.ico$).*)"],
};
