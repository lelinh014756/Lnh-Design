import type { NavSection } from "./nav-config";

/**
 * Điều hướng của cổng nội bộ dành cho đội phát triển.
 *
 * Điểm đáng giữ của template này là `readiness`: sidebar nói thẳng màn nào mới
 * là vỏ giao diện, màn nào đã nối nghiệp vụ. Không có nó, một sidebar đầy đủ
 * mục trông như một sản phẩm đã xong — rồi người dùng bấm vào và gặp 404.
 *
 * `labelKey` tra qua `resolveLabel` mà nơi gọi truyền cho `NavItemRecursive`;
 * bỏ trống thì khoá hiện nguyên văn.
 */
export const DEV_NAV_SECTIONS: NavSection[] = [
  {
    key: "menu",
    labelKey: "browse",
    items: [
      { type: "link", key: "overview", labelKey: "devOverview", path: "/internal", iconKey: "layout-grid" },
      { type: "link", key: "audit", labelKey: "devAuditLog", path: "/internal/audit-log", iconKey: "receipt-text", readiness: "ui_only" },
      { type: "link", key: "flags", labelKey: "devFeatureFlags", path: "/internal/feature-flags", iconKey: "settings", readiness: "partial" },
      { type: "link", key: "monitoring", labelKey: "devMonitoring", path: "/internal/monitoring", iconKey: "circle-dot", readiness: "none" },
    ],
  },
  {
    key: "system",
    labelKey: "foundation",
    items: [
      { type: "link", key: "registry", labelKey: "devRegistry", path: "/internal/registry", iconKey: "package", readiness: "integrated" },
      { type: "link", key: "tokens", labelKey: "devTokens", path: "/tokens", iconKey: "swatch-book" },
    ],
  },
];
