import type { ComponentDemo, PropDoc } from "../../types";

import AppIconGallery from "./gallery";

export const demos: ComponentDemo[] = [
  {
    id: "gallery",
    title: { vi: "Tra theo tên", en: "Lookup by name" },
    description: {
      vi: "Map tĩnh tên → icon lucide. Tên sai là lỗi kiểu lúc biên dịch, không phải ô trống lúc chạy.",
      en: "Static name → lucide icon map. A wrong name is a compile error, not a blank box at runtime.",
    },
    snippet: `<AppIcon icon="shield-check" size={22} className="text-foreground" />`,
    render: AppIconGallery,
  },
];

export const props: PropDoc[] = [
  {
    name: "icon",
    type: "IconName | LucideIcon",
    required: true,
    description: {
      vi: "Tên trong `APP_ICONS`, hoặc component lucide truyền thẳng. Tên không có trong map thì render `null` và cảnh báo ở môi trường dev.",
      en: "A key of `APP_ICONS`, or a lucide component passed directly. Unknown names render `null` with a dev-only warning.",
    },
  },
  {
    name: "size",
    type: "number | string",
    default: "20",
    description: {
      vi: "Gán cho cả `width` và `height` của svg.",
      en: "Applied to both the svg `width` and `height`.",
    },
  },
  {
    name: "strokeWidth",
    type: "number",
    default: "1.75",
    description: {
      vi: "Độ dày nét; mảnh hơn mặc định 2 của lucide.",
      en: "Stroke weight; lighter than lucide's default of 2.",
    },
  },
  {
    name: "...props",
    type: 'Omit<ComponentProps<"svg">, "ref">',
    description: {
      vi: "`className`, `aria-*`… truyền xuống svg.",
      en: "`className`, `aria-*`… pass through to the svg.",
    },
  },
];
