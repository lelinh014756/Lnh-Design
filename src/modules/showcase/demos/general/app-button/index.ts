import type { ComponentDemo, PropDoc } from "../../types";

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
    snippet: `<AppButton preset="add">Thêm mới</AppButton>
<AppButton preset="excel">Xuất Excel</AppButton>`,
    render: AppButtonPresets,
  },
  {
    id: "loading",
    title: { vi: "Trạng thái đang chạy", en: "Loading state" },
    description: {
      vi: "`loading` khoá nút và thay nhãn bằng `loadingText`; `disabled` dùng cho trường hợp không đủ quyền.",
      en: "`loading` locks the button and swaps the label; `disabled` covers the no-permission case.",
    },
    snippet: `<AppButton preset="save" loading={saving}
  loadingText="Đang lưu…" onClick={save}>Lưu thay đổi</AppButton>`,
    render: AppButtonLoading,
  },
  {
    id: "intents",
    title: { vi: "Intent và icon riêng", en: "Intents and custom icon" },
    description: {
      vi: "`intent` đổi màu theo nghĩa hành động, `icon` ghi đè icon mặc định của preset.",
      en: "`intent` colors by meaning; `icon` overrides the preset icon.",
    },
    snippet: `<AppButton intent="destructive">Từ chối</AppButton>
<AppButton icon="shield-check">Xác minh</AppButton>`,
    render: AppButtonIntents,
  },
];

export const props: PropDoc[] = [
  {
    name: "preset",
    type: '"add" | "edit" | "save" | "filter" | "excel" | "gradient"',
    description: {
      vi: "Gói icon + màu. `filter` ép `variant=\"outline\"` và `size=\"icon\"` (chỉ chứa icon); `gradient` ép `variant=\"ghost\"` để nền gradient không bị đè.",
      en: "Icon and color bundle. `filter` forces `variant=\"outline\"` and `size=\"icon\"` (icon-only); `gradient` forces `variant=\"ghost\"` so the gradient isn't overridden.",
    },
  },
  {
    name: "intent",
    type: '"success" | "warning" | "destructive" | "info"',
    description: {
      vi: "Màu theo nghĩa hành động. Độ đậm theo `variant`: mặc định là nền đặc, `outline` là viền nhạt, `ghost` chỉ tô chữ.",
      en: "Color by meaning. Weight follows `variant`: solid by default, tinted border for `outline`, text-only for `ghost`.",
    },
  },
  {
    name: "icon",
    type: "IconName",
    description: {
      vi: "Tên icon đầu nút (xem `AppIcon`); ghi đè icon của preset.",
      en: "Leading icon name (see `AppIcon`); overrides the preset icon.",
    },
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: {
      vi: "Khoá nút, hiện spinner kèm `loadingText` (nút `size=\"icon\"` chỉ hiện spinner).",
      en: "Disables the button and shows a spinner with `loadingText` (icon-size buttons show the spinner only).",
    },
  },
  {
    name: "loadingText",
    type: "string",
    default: '"Đang xử lý..."',
    description: {
      vi: "Nhãn thay thế trong lúc `loading`.",
      en: "Label shown while `loading`.",
    },
  },
  {
    name: "variant",
    type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
    default: '"default"',
    description: {
      vi: "Variant của `Button` gốc; một số preset ghi đè giá trị này.",
      en: "Underlying `Button` variant; some presets override it.",
    },
  },
  {
    name: "size",
    type: '"default" | "xs" | "sm" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
    default: '"lg"',
    description: {
      vi: "Mặc định `lg` (32px), khác với `Button` gốc.",
      en: "Defaults to `lg` (32px), unlike the base `Button`.",
    },
  },
  {
    name: "...props",
    type: "ButtonHTMLAttributes<HTMLButtonElement>",
    description: {
      vi: "`disabled`, `onClick`, `type`… truyền thẳng xuống `<button>`.",
      en: "`disabled`, `onClick`, `type`… pass straight through to `<button>`.",
    },
  },
];
