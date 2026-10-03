import type { ComponentDemo } from "../../types";

import IllustrationsGallery from "./gallery";

export const demos: ComponentDemo[] = [
  {
    id: "gallery",
    title: { vi: "Bộ hình trạng thái", en: "State illustrations" },
    description: {
      vi: "Ba trạng thái khác nhau cần ba hình khác nhau: chưa có dữ liệu ≠ lọc không ra ≠ lỗi hệ thống.",
      en: "Three different states need three different pictures: no data ≠ no matches ≠ system error.",
    },
    render: IllustrationsGallery,
  },
];
