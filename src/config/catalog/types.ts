import type { IconName } from "@/components/general/app-icon";

/**
 * Kiểu dữ liệu cho catalog showcase.
 *
 * Toàn bộ catalog là DATA THUẦN — không nhét component/function reference —
 * để `scripts/registry-builder` (chạy bằng Node, không qua bundler JSX) và các
 * trang React đều import chung một nguồn. Map `slug → component thật` cho
 * `/preview/[name]` nằm riêng ở `src/config/preview-registry.tsx`.
 */

/** 7 nhóm phân loại theo Ant Design. Feed thẳng vào field `categories` của registry-item.json. */
export type CatalogCategory =
  | "general"
  | "layout"
  | "navigation"
  | "data-entry"
  | "data-display"
  | "feedback"
  | "other";

export const CATALOG_CATEGORIES: readonly CatalogCategory[] = [
  "general",
  "layout",
  "navigation",
  "data-entry",
  "data-display",
  "feedback",
  "other",
] as const;

export const CATEGORY_ICONS: Record<CatalogCategory, IconName> = {
  general: "box",
  layout: "layout-grid",
  navigation: "list",
  "data-entry": "pencil",
  "data-display": "layers",
  feedback: "circle-alert",
  other: "package",
};

export type CatalogKind = "component" | "block" | "template";

/** Facet lọc riêng ở tab `/blocks`, ĐỘC LẬP với `categories`. */
export type BlockKind = "application" | "data-grid" | "solutions";

/** Item public (`@lnhdesign/*`) hay chỉ nội bộ (`@lnhdesign-x/*`, cần token). */
export type CatalogVisibility = "public" | "internal";

/**
 * Chuỗi hiển thị song ngữ nằm ngay trong data.
 *
 * Không đi qua dictionary như phần còn lại của site: catalog phải import được
 * từ script Node thuần, còn hệ i18n là React context. Giữ hai bản cạnh nhau ở
 * đây thì không thể lệch — thêm item mà quên bản dịch là lỗi kiểu, không phải
 * lỗi lúc chạy.
 */
export interface LocalizedText {
  vi: string;
  en: string;
}

interface CatalogItemBase {
  /**
   * Slug — TRÙNG tên thư mục `registry/radix-mira/{nhóm}/{slug}/`, tên registry
   * item `@lnhdesign/{slug}`, VÀ param của route `/preview/[name]`. Một giá trị,
   * ba chỗ dùng — lệch chỗ nào cũng vỡ liên kết.
   */
  slug: string;
  /** Tên hiển thị trên card/sidebar. Danh từ riêng, không dịch. */
  name: string;
  description: LocalizedText;
  categories: CatalogCategory[];
  /** Ảnh chụp cho lưới card. Bỏ trống thì card dựa vào live iframe preview. */
  thumbnail?: string;
  isNew?: boolean;
  visibility: CatalogVisibility;
}

export interface ComponentCatalogItem extends CatalogItemBase {
  kind: "component";
  /** `primitive` = thẳng từ `ui/` (shadcn gốc); `app` = component cấp app tự build. */
  layer: "primitive" | "app";
}

export interface BlockCatalogItem extends CatalogItemBase {
  kind: "block";
  blockKind: BlockKind;
}

export interface TemplateCatalogItem extends CatalogItemBase {
  kind: "template";
  /** Chip tech stack trên card index. */
  techStack: string[];
  /** 4 cột bảng Details ở trang chi tiết template. */
  framework: string;
  base: string;
  style: string;
  surface: string;
}

export type CatalogItem = ComponentCatalogItem | BlockCatalogItem | TemplateCatalogItem;
