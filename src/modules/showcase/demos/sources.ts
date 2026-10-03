import sources from "./generated/sources.json";

/**
 * Mã nguồn demo, trích lúc build bởi `pnpm demos:build`.
 *
 * Thư mục `generated/` không vào git: nó suy được hoàn toàn từ file demo, commit
 * vào chỉ tạo diff trùng lặp trong mọi PR đụng tới demo. `predev` và `build` đều
 * chạy script trước, nên file luôn có mặt khi cần.
 */
const sourceMap = sources as Record<string, string>;

export function demoSource(slug: string, demoId: string): string | undefined {
  return sourceMap[`${slug}/${demoId}`];
}
