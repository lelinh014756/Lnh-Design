import type { BlockCatalogItem } from "./types";

/**
 * Block = cụm nhiều component ghép thành một mảng giao diện chạy được.
 *
 * `blockKind` là facet lọc riêng của trang `/blocks`, độc lập với `categories`
 * (categories vẫn dùng cho sidebar 7 nhóm).
 */
export const blockItems: BlockCatalogItem[] = [
  {
    kind: "block",
    blockKind: "data-grid",
    slug: "table-core",
    name: "Table Core",
    categories: ["data-display"],
    description: {
      vi: "Nền tảng state/options của bảng: hook lõi, cột hiển thị, tuỳ chọn người dùng, localization.",
      en: "Table state foundation: core hook, display columns, user prefs, localization.",
    },
    visibility: "public",
    isNew: true,
  },
  {
    kind: "block",
    blockKind: "data-grid",
    slug: "table-chrome",
    name: "Table Chrome",
    categories: ["data-display"],
    description: {
      vi: "Lớp vỏ dùng chung cho mọi renderer bảng: mật độ, toàn màn hình, ẩn/hiện cột, sheet bộ lọc.",
      en: "Shared table chrome: density, fullscreen, column visibility, filter sheet.",
    },
    visibility: "public",
    isNew: true,
  },
  {
    kind: "block",
    blockKind: "data-grid",
    slug: "data-table",
    name: "Data Table",
    categories: ["data-display"],
    description: {
      vi: "Bảng dữ liệu đầy đủ: ghim cột, kéo giãn, chọn dòng, action bar, phân trang, xuất CSV.",
      en: "Full data table: pinning, resizing, row selection, action bar, pagination, CSV export.",
    },
    visibility: "public",
    isNew: true,
  },
  {
    kind: "block",
    blockKind: "data-grid",
    slug: "data-table-url",
    name: "Data Table URL State",
    categories: ["data-display"],
    description: {
      vi: "Đồng bộ phân trang, sắp xếp và bộ lọc nâng cao vào URL bằng nuqs — chia sẻ link là ra đúng khung nhìn.",
      en: "Syncs pagination, sorting and advanced filters into the URL via nuqs.",
    },
    visibility: "public",
    isNew: true,
  },
  {
    kind: "block",
    blockKind: "application",
    slug: "stats-overview",
    name: "Stats Overview",
    categories: ["layout"],
    description: {
      vi: "Hàng thẻ chỉ số kèm biểu đồ — mảng đầu trang của mọi màn dashboard.",
      en: "KPI row plus chart — the opening block of any dashboard screen.",
    },
    visibility: "public",
  },
  {
    kind: "block",
    blockKind: "application",
    slug: "nav-tree",
    name: "Nav Tree",
    categories: ["navigation"],
    description: {
      vi: "Cây điều hướng lồng nhiều cấp: model nav, chấm trạng thái triển khai, render đệ quy tự bung nhánh đang mở.",
      en: "Recursive nav tree: nav model, build-readiness dots, auto-opens the active branch.",
    },
    visibility: "public",
  },
  {
    kind: "block",
    blockKind: "application",
    slug: "empty-states",
    name: "Empty States",
    categories: ["feedback"],
    description: {
      vi: "Bộ trạng thái rỗng, lỗi và đang tải dùng chung — hình minh hoạ vẽ bằng token màu.",
      en: "Empty, error and loading states drawn with design tokens.",
    },
    visibility: "public",
  },
  {
    kind: "block",
    blockKind: "application",
    slug: "auth-login",
    name: "Login Form",
    categories: ["data-entry"],
    description: {
      vi: "Form đăng nhập hai cột: hero bên trái, form có kiểm tra dữ liệu bên phải.",
      en: "Two-column sign-in: hero panel and validated form.",
    },
    visibility: "public",
  },
];
