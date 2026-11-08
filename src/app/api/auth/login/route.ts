import { NextResponse } from "next/server";

import { sessionCookieOptions, SESSION_COOKIE, signSession } from "@/lib/auth/session";
import { authenticate } from "@/lib/auth/users";

// PBKDF2 210k vòng và `crypto.subtle` — chạy trên Node runtime, không Edge.
export const runtime = "nodejs";

/**
 * Đăng nhập khu vực nội bộ.
 *
 * Mọi nhánh thất bại trả CÙNG một thông báo và cùng mã 401: phân biệt "email
 * không tồn tại" với "sai mật khẩu" là tặng không cho người dò một danh sách
 * email hợp lệ.
 */
export async function POST(request: Request) {
  let email: unknown;
  let password: unknown;

  try {
    ({ email, password } = await request.json());
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const authenticated = await authenticate(email, password);
    if (!authenticated) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ email: authenticated });
    response.cookies.set(SESSION_COOKIE, await signSession(authenticated), sessionCookieOptions);
    return response;
  } catch (error) {
    // Thiếu LNHDESIGN_SESSION_SECRET ném ở đây. Ghi log để người vận hành thấy
    // nguyên nhân thật, còn phía người dùng chỉ nhận lỗi máy chủ chung chung.
    console.error("[auth/login] không tạo được phiên:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
