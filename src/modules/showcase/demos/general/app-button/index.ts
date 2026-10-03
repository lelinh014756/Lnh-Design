import type { ComponentDemo } from "../../types";

import AppButtonIntents from "./intents";
import AppButtonLoading from "./loading";
import AppButtonPresets from "./presets";

export const demos: ComponentDemo[] = [
  {
    id: "presets",
    title: { vi: "Preset", en: "Presets" },
    description: {
      vi: "Mỗi preset gói sẵn icon và màu cho một hành động quen thuộc — khai `preset` thay vì ráp lại từng lần.",
      en: "Each preset bundles the icon and color of a familiar action instead of re-assembling them per call site.",
    },
    render: AppButtonPresets,
  },
  {
    id: "loading",
    title: { vi: "Trạng thái đang chạy", en: "Loading state" },
    description: {
      vi: "`loading` khoá nút và thay nhãn bằng `loadingText`; `disabled` dùng cho trường hợp không đủ quyền.",
      en: "`loading` locks the button and swaps the label; `disabled` covers the no-permission case.",
    },
    render: AppButtonLoading,
  },
  {
    id: "intents",
    title: { vi: "Intent và icon riêng", en: "Intents and custom icon" },
    description: {
      vi: "`intent` đổi màu theo nghĩa hành động, `icon` ghi đè icon mặc định của preset.",
      en: "`intent` colors by meaning; `icon` overrides the preset icon.",
    },
    render: AppButtonIntents,
  },
];
