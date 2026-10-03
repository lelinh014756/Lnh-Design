import type { DemoModule } from "./types";

/**
 * Map `slug → module demo`, nạp lười.
 *
 * Giá trị là HÀM trả promise, không phải module đã import: trang
 * `/components/[slug]` chỉ kéo về chunk của đúng component đang xem. Một barrel
 * `export *` ở đây sẽ gộp toàn bộ demo của mọi component vào một chunk và trang
 * nào cũng phải tải hết.
 *
 * Khai tường minh thay vì quét thư mục: gõ sai đường dẫn là lỗi biên dịch, chứ
 * không phải một trang trống lúc chạy.
 */
export const demoModules: Record<string, () => Promise<DemoModule>> = {
  "app-button": () => import("./general/app-button"),
  "actions-button": () => import("./general/actions-button"),
  "app-icon": () => import("./general/app-icon"),
  "app-card": () => import("./layout/app-card"),
  "statistics-card": () => import("./layout/statistics-card"),
  "statistics-card-grid": () => import("./layout/statistics-card-grid"),
  "nav-item-recursive": () => import("./navigation/nav-item-recursive"),
  illustrations: () => import("./feedback/illustrations"),
};

export function hasDemos(slug: string): boolean {
  return slug in demoModules;
}

export async function loadDemoModule(slug: string): Promise<DemoModule> {
  const load = demoModules[slug];
  return load ? load() : { demos: [] };
}

export async function loadDemos(slug: string): Promise<DemoModule["demos"]> {
  return (await loadDemoModule(slug)).demos;
}
