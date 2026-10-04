import type { ComponentDemo, PropDoc } from "../../types";

import AppIconGallery from "./gallery";

export const demos: ComponentDemo[] = [
  {
    id: "gallery",
    title: { vi: "Tra theo tên", en: "Lookup by name" },
    description: {
      vi: "Tra theo tên qua provider đang active (hugeicons/lucide) — đổi thư viện bằng một dòng import trong `app-icon.tsx`. Tên sai là lỗi kiểu lúc biên dịch, không phải ô trống lúc chạy.",
      en: "Name lookup through the active provider (hugeicons/lucide) — swap libraries with one import line in `app-icon.tsx`. A wrong name is a compile error, not a blank box at runtime.",
    },
    snippet: `<AppIcon icon="shield-check" size={22} className="text-foreground" />`,
    render: AppIconGallery,
  },
];

export const props: PropDoc[] = [
  {
    name: "icon",
    type: "IconName",
    required: true,
    description: {
      vi: "Tên trong `ICON_NAMES`. Tên lọt qua dữ liệu chưa kiểu hoá mà provider không có thì render `null` và cảnh báo ở môi trường dev.",
      en: "A key of `ICON_NAMES`. An unknown name slipping through untyped data renders `null` with a dev-only warning.",
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
    default: "provider",
    description: {
      vi: "Độ dày nét; mặc định theo provider (hugeicons 1.5, lucide 1.75). Dùng prop này thay vì class `stroke-*` — hugeicons đặt nét trên từng path.",
      en: "Stroke weight; defaults per provider (hugeicons 1.5, lucide 1.75). Use this prop instead of `stroke-*` classes — hugeicons sets stroke per path.",
    },
  },
  {
    name: "...props",
    type: 'Omit<ComponentProps<"svg">, "ref">',
    description: {
      vi: "`className`, `aria-*`… truyền xuống svg. Tự gắn `aria-hidden` khi không có `aria-label`/`aria-labelledby`, và `data-icon` để debug/E2E.",
      en: "`className`, `aria-*`… pass through to the svg. Adds `aria-hidden` unless `aria-label`/`aria-labelledby` is set, plus `data-icon` for debugging/E2E.",
    },
  },
];
