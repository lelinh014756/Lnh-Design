import { readFile } from "node:fs/promises";
import path from "node:path";

import { APP_ROOT } from "./config.mjs";

/**
 * Manifest đóng gói: item nào gồm những file nào.
 *
 * Tách khỏi catalog có chủ ý — catalog trả lời "hiện gì lên trang", manifest
 * trả lời "chép file nào về máy người dùng". Trộn hai thứ vào một file thì đổi
 * mô tả hiển thị cũng phải chạm vào định nghĩa gói.
 *
 * Component đơn giản KHÔNG cần khai ở đây: builder tự suy theo quy ước
 * `src/components/ui/{slug}.tsx`. Chỉ item nhiều file mới cần một mục.
 */
export async function readManifest() {
  const raw = await readFile(path.join(APP_ROOT, "registry.manifest.json"), "utf8");
  return JSON.parse(raw);
}
