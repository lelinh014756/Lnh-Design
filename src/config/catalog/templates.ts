import type { TemplateCatalogItem } from "./types";

/**
 * Template = một sản phẩm nhiều trang chạy được, không phải một mảng giao diện.
 *
 * v1 cố ý chỉ có một template thật thay vì lấp đầy mục — thứ đáng port là
 * pattern `NavReadiness` chấm trạng thái triển khai lên sidebar, cho biết màn
 * nào mới là vỏ UI và màn nào đã nối nghiệp vụ.
 */
export const templateItems: TemplateCatalogItem[] = [
  {
    kind: "template",
    slug: "dev-portal",
    name: "Dev Portal",
    categories: ["layout"],
    description: {
      vi: "Cổng nội bộ cho đội phát triển: nhật ký kiểm toán, cờ tính năng, giám sát — sidebar có chấm trạng thái triển khai.",
      en: "Internal dev portal: audit log, feature flags, monitoring — sidebar shows build readiness.",
    },
    visibility: "internal",
    isNew: true,
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "TanStack Table", "Radix UI"],
    framework: "Next.js 16 (App Router)",
    base: "Radix UI",
    style: "radix-mira",
    surface: "Sidebar",
  },
];
