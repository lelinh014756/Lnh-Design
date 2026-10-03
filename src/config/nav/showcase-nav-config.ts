import type { IconName } from "@/components/general/app-icon";
import type { Dictionary } from "@/lib/i18n/types";

/**
 * Điều hướng cấp site cho khu vực showcase.
 *
 * Phẳng một tầng, cố ý không dùng lại `NavSection` của app portal: mô hình đó
 * mang readiness + subgroup lồng nhau để dựng sidebar nghiệp vụ, còn ở đây chỉ
 * là một hàng link trên header. Sidebar trái do `CatalogSidebar` dựng từ
 * catalog, không từ file này.
 *
 * `labelKey` là khoá THẬT của `dict.nav` — gõ sai là lỗi biên dịch, không
 * phải chuỗi khoá lọt ra giao diện.
 */
export interface ShowcaseNavItem {
  key: string;
  labelKey: keyof Dictionary["nav"];
  href: string;
  iconKey: IconName;
  /** Chỉ hiện khi đã đăng nhập. */
  internal?: boolean;
}

export const SHOWCASE_NAV: ShowcaseNavItem[] = [
  { key: "components", labelKey: "components", href: "/components", iconKey: "component" },
  { key: "blocks", labelKey: "blocks", href: "/blocks", iconKey: "layers" },
  { key: "templates", labelKey: "templates", href: "/templates", iconKey: "layout-grid" },
  { key: "docs", labelKey: "docs", href: "/docs", iconKey: "book-open" },
  { key: "icons", labelKey: "icons", href: "/icons", iconKey: "sparkles" },
  { key: "tokens", labelKey: "tokens", href: "/tokens", iconKey: "swatch-book" },
];

export const INTERNAL_NAV: ShowcaseNavItem[] = [
  { key: "internal", labelKey: "internal", href: "/internal", iconKey: "lock", internal: true },
];

export function isNavHrefActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
