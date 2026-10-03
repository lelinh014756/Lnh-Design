import type { ComponentDemo } from "../../types";

import AppIconGallery from "./gallery";

export const demos: ComponentDemo[] = [
  {
    id: "gallery",
    title: { vi: "Tra theo tên", en: "Lookup by name" },
    description: {
      vi: "Map tĩnh tên → icon lucide. Tên sai là lỗi kiểu lúc biên dịch, không phải ô trống lúc chạy.",
      en: "Static name → lucide icon map. A wrong name is a compile error, not a blank box at runtime.",
    },
    render: AppIconGallery,
  },
];
