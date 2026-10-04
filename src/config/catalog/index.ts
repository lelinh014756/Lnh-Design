import { blockItems } from "./blocks";
import { componentItems } from "./components";
import { templateItems } from "./templates";
import {
  CATALOG_CATEGORIES,
  type BlockCatalogItem,
  type BlockKind,
  type CatalogCategory,
  type CatalogItem,
  type CatalogKind,
  type ComponentCatalogItem,
  type TemplateCatalogItem,
} from "./types";

export * from "./types";
export { blockItems, componentItems, templateItems };

/** Nguồn sự thật duy nhất: sidebar, số đếm, `categories` của registry item, và route `/preview/[name]` đều đọc từ đây. */
export const componentCatalog: CatalogItem[] = [
  ...componentItems,
  ...blockItems,
  ...templateItems,
];

/**
 * Component được phơi ra giao diện showcase.
 *
 * Primitive (`layer: "primitive"`) VẪN nằm trong `componentItems`: registry
 * builder suy `registryDependencies` từ bảng chủ sở hữu file dựng trên toàn bộ
 * catalog, gỡ chúng ra là `app-button` mất `@aurecook/button` và closure vỡ.
 * Ẩn ở đây là quyết định sản phẩm — người dùng cài component cấp app, primitive
 * đi theo như phụ thuộc.
 */
export const showcaseComponentItems: ComponentCatalogItem[] = componentItems.filter(
  (item) => item.layer === "app",
);

export interface CatalogGroup<T extends CatalogItem> {
  category: CatalogCategory;
  items: T[];
}

/**
 * Gom item theo nhóm, BỎ nhóm rỗng.
 *
 * Khác quy ước cũ (nhóm 0 item vẫn hiện): hồi đó nhóm là một link bấm được nên
 * cần cho người dùng biết nó tồn tại. Nay nhóm chỉ là nhãn của một danh sách —
 * nhãn không có gì bên dưới thì chỉ là nhiễu.
 */
export function groupByCategory<T extends CatalogItem>(items: T[]): CatalogGroup<T>[] {
  return CATALOG_CATEGORIES.map((category) => ({
    category,
    items: itemsInCategory(items, category),
  })).filter((group) => group.items.length > 0);
}

/** Facet của `/blocks`, độc lập với 7 nhóm category. `all` là giá trị lọc, không phải một loại. */
export const BLOCK_KINDS: readonly BlockKind[] = ["application", "data-grid", "solutions"] as const;

export type BlockKindFilter = BlockKind | "all";

export const BLOCK_KIND_FILTERS: readonly BlockKindFilter[] = ["all", ...BLOCK_KINDS] as const;

export function isBlockKind(value: string): value is BlockKind {
  return (BLOCK_KINDS as readonly string[]).includes(value);
}

export function blocksOfKind(items: BlockCatalogItem[], kind: BlockKindFilter): BlockCatalogItem[] {
  return kind === "all" ? items : items.filter((item) => item.blockKind === kind);
}

/**
 * Số block mỗi loại, KỂ CẢ loại đang rỗng.
 *
 * Tab hiện số 0 vẫn có ích: nó nói "loại này tồn tại, chưa có gì" — khác hẳn
 * với việc tab biến mất, khiến người dùng tưởng hệ không phân loại như vậy.
 */
export function countByKind(items: BlockCatalogItem[]): Record<BlockKindFilter, number> {
  const counts = Object.fromEntries(BLOCK_KIND_FILTERS.map((kind) => [kind, 0])) as Record<
    BlockKindFilter,
    number
  >;

  counts.all = items.length;
  for (const item of items) counts[item.blockKind] += 1;

  return counts;
}

const bySlug = new Map(componentCatalog.map((item) => [item.slug, item]));

export function findCatalogItem(slug: string): CatalogItem | undefined {
  return bySlug.get(slug);
}

export function itemsOfKind(kind: "component"): ComponentCatalogItem[];
export function itemsOfKind(kind: "block"): BlockCatalogItem[];
export function itemsOfKind(kind: "template"): TemplateCatalogItem[];
export function itemsOfKind(kind: CatalogKind): CatalogItem[] {
  return componentCatalog.filter((item) => item.kind === kind);
}

export function itemsInCategory<T extends CatalogItem>(
  items: T[],
  category: CatalogCategory,
): T[] {
  return items.filter((item) => item.categories.includes(category));
}

/** Số item mỗi nhóm, dùng cho sidebar và card index. Nhóm rỗng vẫn trả 0 để layout không nhảy. */
export function countByCategory(items: CatalogItem[]): Record<CatalogCategory, number> {
  const counts = Object.fromEntries(
    CATALOG_CATEGORIES.map((category) => [category, 0]),
  ) as Record<CatalogCategory, number>;

  for (const item of items) {
    for (const category of item.categories) counts[category] += 1;
  }

  return counts;
}

export function isCatalogCategory(value: string): value is CatalogCategory {
  return (CATALOG_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Item đã gộp vào item khác → đích mới (`slug#neo`). Trang cũ redirect thay vì
 * 404 để link ngoài không chết. Chỉ giữ được URL trang showcase: lệnh cài
 * `@aurecook/{slug-cũ}` của CLI thì không chuyển hướng được.
 */
export const mergedComponentSlugs: Readonly<Record<string, string>> = {
  "refresh-button": "app-button#refresh",
};

/** Tên item khi cài qua CLI. Item nội bộ nằm ở namespace riêng cần token. */
export function registryItemName(item: CatalogItem): string {
  return item.visibility === "internal" ? `@aurecook-x/${item.slug}` : `@aurecook/${item.slug}`;
}

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

/**
 * Lệnh cài theo trình quản lý gói người dùng đang dùng.
 *
 * Bốn cú pháp khác nhau THẬT SỰ, không phải đổi tên lệnh: `npx`/`bunx` chạy
 * thẳng, `pnpm dlx`/`yarn dlx` tải tạm rồi chạy. Chép nhầm cú pháp là một lần
 * dán vào terminal rồi phải quay lại đọc docs.
 */
export function installCommandFor(item: CatalogItem, manager: PackageManager): string {
  const name = registryItemName(item);

  switch (manager) {
    case "npm":
      return `npx shadcn@latest add ${name}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${name}`;
    case "bun":
      return `bunx --bun shadcn@latest add ${name}`;
    default:
      return `pnpm dlx shadcn@latest add ${name}`;
  }
}

export function installCommand(item: CatalogItem): string {
  return installCommandFor(item, "pnpm");
}

export const catalogStats = {
  components: componentItems.length,
  blocks: blockItems.length,
  templates: templateItems.length,
} as const;
