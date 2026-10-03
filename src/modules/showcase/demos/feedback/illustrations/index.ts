import type { ComponentDemo, PropDoc } from "../../types";

import IllustrationsGallery from "./gallery";

export const demos: ComponentDemo[] = [
  {
    id: "gallery",
    title: { vi: "Bộ hình trạng thái", en: "State illustrations" },
    description: {
      vi: "Ba trạng thái khác nhau cần ba hình khác nhau: chưa có dữ liệu ≠ lọc không ra ≠ lỗi hệ thống.",
      en: "Three different states need three different pictures: no data ≠ no matches ≠ system error.",
    },
    snippet: `<EmptyListIllustration label="Chưa có dữ liệu" />
<EmptySearchIllustration label="Không khớp bộ lọc" />
<ErrorGenericIllustration label="Có lỗi xảy ra" />`,
    render: IllustrationsGallery,
  },
];

/** Chung cho mọi illustration trong bộ (`IllustrationCommonProps`). */
export const props: PropDoc[] = [
  {
    name: "label",
    type: "string",
    description: {
      vi: "Thành `aria-label` của hình, không hiện thành chữ. Mỗi hình có mặc định tiếng Anh riêng (\"No data\", \"No results found\"…).",
      en: "Becomes the image's `aria-label`; not rendered as text. Each illustration has its own English default (\"No data\", \"No results found\"…).",
    },
  },
  {
    name: "sizeTier",
    type: '"grid" | "inline" | "panel" | "fullscreen"',
    default: '"inline"',
    description: {
      vi: "Cỡ responsive bằng `clamp()` theo viewport: ô lưới admin → panel trống → trang lỗi → toàn màn hình.",
      en: "Responsive size via viewport `clamp()`: admin grid cell → empty panel → error page → full screen.",
    },
  },
  {
    name: "size",
    type: "number",
    description: {
      vi: "Cỡ cố định (px), ghi đè `sizeTier`.",
      en: "Fixed size in px; overrides `sizeTier`.",
    },
  },
  {
    name: "className",
    type: "string",
    description: { vi: "Gắn lên `<figure>` ngoài cùng.", en: "Applied to the outer `<figure>`." },
  },
];
