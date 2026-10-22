import { NextResponse } from "next/server";

import { APP_REGISTRY_TOKEN } from "@/config/env";
import { getRegistryItem } from "@/lib/registry/load";

/**
 * Registry nội bộ: `GET /r/internal/{name}.json`.
 *
 * Gác bằng `Authorization: Bearer`, KHÔNG bằng cookie phiên: bên gọi là CLI
 * `shadcn` chạy trên máy dev, nó không có cookie và cần 401 để báo lỗi rõ ràng
 * thay vì bị chuyển hướng sang trang HTML đăng nhập rồi báo "JSON không hợp lệ".
 *
 * `proxy.ts` cố ý không đụng vào tiền tố này — xem chú thích ở đó.
 */
function isAuthorized(request: Request): boolean {
  const expected = APP_REGISTRY_TOKEN;
  // Thiếu token phía server nghĩa là chưa cấu hình xong — từ chối hết, không
  // im lặng mở cửa.
  if (!expected) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  const provided = header.slice("Bearer ".length).trim();
  if (provided.length !== expected.length) return false;

  // So sánh hết chuỗi dù đã lệch — thời gian phản hồi không tiết lộ đúng được
  // bao nhiêu ký tự đầu.
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Cần LNHDESIGN_TOKEN hợp lệ trong header Authorization." },
      { status: 401, headers: { "WWW-Authenticate": 'Bearer realm="lnhdesign"' } },
    );
  }

  const { name } = await params;
  const slug = name.replace(/\.json$/, "");

  const item = await getRegistryItem("internal", slug);
  if (!item) {
    return NextResponse.json(
      { error: `Không có item "${slug}" trong registry nội bộ.` },
      { status: 404 },
    );
  }

  // Item nội bộ không được nằm lại trong bất kỳ cache dùng chung nào.
  return NextResponse.json(item, { headers: { "Cache-Control": "private, no-store" } });
}
