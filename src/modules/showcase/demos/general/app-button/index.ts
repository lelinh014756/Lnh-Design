import type { ComponentDemo, PropDoc } from "../../types";

import AppButtonAsChild from "./as-child";
import AppButtonConfirm from "./confirm";
import AppButtonFamily from "./family";
import AppButtonGradientSizes from "./gradient-sizes";
import AppButtonIntents from "./intents";
import AppButtonLoading from "./loading";
import AppButtonRefresh from "./refresh";

export const demos: ComponentDemo[] = [
  {
    id: "family",
    title: { vi: "Họ nút đặt sẵn", en: "Preset family" },
    description: {
      vi: "`ButtonAdd`, `ButtonSave`, `ButtonEdit`, `ButtonSend`, `ButtonConfirm`, `ButtonCancel` gói sẵn icon và kiểu cho hành động quen thuộc. `ButtonSave` đổi nhãn theo `isEdit`.",
      en: "`ButtonAdd`, `ButtonSave`, `ButtonEdit`, `ButtonSend`, `ButtonConfirm`, `ButtonCancel` bundle the icon and style of familiar actions. `ButtonSave` switches its label with `isEdit`.",
    },
    snippet: `<ButtonAdd>Thêm căn</ButtonAdd>
<ButtonSave isEdit />
<ButtonCancel />`,
    render: AppButtonFamily,
  },
  {
    id: "loading",
    title: { vi: "Trạng thái đang chạy", en: "Loading state" },
    description: {
      vi: "`loading` khoá nút và thay nhãn bằng `loadingText`; nút chỉ có icon thì chỉ hiện spinner. `disabled` dùng cho trường hợp không đủ quyền.",
      en: "`loading` locks the button and swaps in `loadingText`; icon-only buttons show just the spinner. `disabled` covers the no-permission case.",
    },
    snippet: `<ButtonSave isEdit loading={saving} loadingText="Đang lưu…" onClick={save} />`,
    render: AppButtonLoading,
  },
  {
    id: "intents",
    title: { vi: "Màu theo nghĩa hành động", en: "Intent colors" },
    description: {
      vi: "`ButtonIntent` tô màu theo `intent`; độ đậm theo `variant` — mặc định nền đặc, `outline` viền nhạt, `ghost` chỉ tô chữ.",
      en: "`ButtonIntent` colors by `intent`; weight follows `variant` — solid by default, tinted border for `outline`, text-only for `ghost`.",
    },
    snippet: `<ButtonIntent intent="destructive">Từ chối</ButtonIntent>
<ButtonIntent intent="success" variant="outline">Duyệt</ButtonIntent>`,
    render: AppButtonIntents,
  },
  {
    id: "confirm",
    title: { vi: "Xác nhận trước khi chạy", en: "Confirm before running" },
    description: {
      vi: "`needsConfirm` mở hộp xác nhận thay vì chạy ngay; `onConfirm` async thì hộp giữ spinner và không đóng được tới khi xong. Handler ném lỗi thì hộp vẫn mở để thử lại.",
      en: "`needsConfirm` opens a confirm dialog instead of acting; an async `onConfirm` keeps the dialog busy and unclosable until done. If it throws, the dialog stays open for a retry.",
    },
    snippet: `<ButtonIntent intent="destructive" icon="trash-2" needsConfirm
  confirmTitle="Xoá căn A12-05?" onConfirm={remove}>Xoá căn</ButtonIntent>`,
    render: AppButtonConfirm,
  },
  {
    id: "refresh",
    title: { vi: "Làm mới có khoá", en: "Refresh with cooldown" },
    description: {
      vi: "`ButtonRefresh` khoá và đếm ngược `cooldown` giây sau mỗi lần bấm; đang `fetching` thì icon xoay và đếm ngược tạm dừng. Chế độ icon có tooltip và `aria-label` từ `label`.",
      en: "`ButtonRefresh` locks and counts down `cooldown` seconds after each click; while `fetching` the icon spins and the countdown pauses. Icon mode gets a tooltip and `aria-label` from `label`.",
    },
    snippet: `<ButtonRefresh fetching={isFetching} onClick={() => refetch()} />
<ButtonRefresh display="text" cooldown={8} onClick={() => refetch()} />`,
    render: AppButtonRefresh,
  },
  {
    id: "gradient-sizes",
    title: { vi: "Gradient và kích thước", en: "Gradient and sizes" },
    description: {
      vi: "`isGradient` cho hành động chính. Cỡ nút là bảng riêng của AppButton (mặc định `lg`, cao 36px), không đụng `Button` gốc dùng chung.",
      en: "`isGradient` for primary actions. Sizes come from AppButton's own scale (default `lg`, 36px tall), leaving the shared `Button` untouched.",
    },
    snippet: `<AppButton size="sm" icon="sparkles" isGradient>Nâng cấp</AppButton>
<AppButton size="icon" icon="printer" aria-label="In phiếu" />`,
    render: AppButtonGradientSizes,
  },
  {
    id: "as-child",
    title: { vi: "Render thành link", en: "Render as a link" },
    description: {
      vi: "`asChild` mượn kiểu nút cho phần tử con. Khi đó `icon`, spinner bị bỏ qua — `Slot` chỉ nhận đúng một phần tử.",
      en: "`asChild` lends the button styling to its child. `icon` and the spinner are skipped then — `Slot` takes exactly one element.",
    },
    snippet: `<AppButton asChild variant="outline">
  <a href="/docs">Xem tài liệu</a>
</AppButton>`,
    render: AppButtonAsChild,
  },
];

export const props: PropDoc[] = [
  {
    name: "icon",
    type: "IconName",
    description: {
      vi: "Icon đầu nút, tra theo tên qua provider của `AppIcon`. Các nút trong họ có icon mặc định riêng, truyền `icon` để ghi đè.",
      en: "Leading icon, looked up by name through the `AppIcon` provider. Family buttons have their own default, override with `icon`.",
    },
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: {
      vi: "Khoá nút, hiện spinner kèm `loadingText` (nút cỡ `icon*` chỉ hiện spinner).",
      en: "Disables the button and shows a spinner with `loadingText` (`icon*` sizes show the spinner only).",
    },
  },
  {
    name: "loadingText",
    type: "string",
    default: '"Đang xử lý..."',
    description: { vi: "Nhãn thay thế trong lúc `loading`.", en: "Label shown while `loading`." },
  },
  {
    name: "isGradient",
    type: "boolean",
    default: "false",
    description: {
      vi: "Nền gradient `primary` → `brand-secondary`. `ButtonAdd` và `ButtonSave` bật sẵn.",
      en: "`primary` → `brand-secondary` gradient. On by default for `ButtonAdd` and `ButtonSave`.",
    },
  },
  {
    name: "needsConfirm",
    type: "boolean",
    default: "false",
    description: {
      vi: "Bấm nút mở hộp xác nhận thay vì chạy `onClick`.",
      en: "Clicking opens a confirm dialog instead of running `onClick`.",
    },
  },
  {
    name: "onConfirm",
    type: "() => void | Promise<void>",
    description: {
      vi: "Chạy sau khi bấm Xác nhận. Vắng thì chạy `onClick` với event của cú bấm gốc. Lỗi ném ra được ghi console, hộp vẫn mở.",
      en: "Runs after Confirm. Without it, `onClick` runs with the original click event. Thrown errors are logged and the dialog stays open.",
    },
  },
  {
    name: "confirmTitle / confirmDescription",
    type: "string / ReactNode",
    default: '"Xác nhận thao tác?"',
    description: { vi: "Nội dung hộp xác nhận.", en: "Confirm dialog content." },
  },
  {
    name: "confirmLabel / cancelLabel",
    type: "string",
    default: '"Xác nhận" / "Huỷ bỏ"',
    description: { vi: "Nhãn hai nút trong hộp xác nhận.", en: "Labels of the dialog buttons." },
  },
  {
    name: "confirmLoadingText",
    type: "string",
    default: "loadingText",
    description: {
      vi: "Chữ trên nút xác nhận lúc đang chạy.",
      en: "Confirm button label while running.",
    },
  },
  {
    name: "asChild",
    type: "boolean",
    default: "false",
    description: {
      vi: "Mượn kiểu nút cho phần tử con duy nhất; bỏ qua `icon` và spinner.",
      en: "Styles the single child element instead; `icon` and the spinner are skipped.",
    },
  },
  {
    name: "variant",
    type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
    default: '"default"',
    description: {
      vi: "Variant của `Button` gốc. Với `ButtonIntent`, quyết định độ đậm của màu.",
      en: "Underlying `Button` variant. For `ButtonIntent` it sets the color weight.",
    },
  },
  {
    name: "size",
    type: '"default" | "xs" | "sm" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
    default: '"lg"',
    description: {
      vi: "Bảng cỡ riêng của AppButton: `lg` cao 36px (`Button` gốc 32px). `xl` giữ cỡ gốc.",
      en: "AppButton's own scale: `lg` is 36px (base `Button` is 32px). `xl` keeps the base size.",
    },
  },
  {
    name: "intent",
    type: '"success" | "warning" | "destructive" | "info"',
    required: true,
    description: {
      vi: "Chỉ có ở `ButtonIntent`. Không kết hợp với `isGradient`.",
      en: "`ButtonIntent` only. Not combined with `isGradient`.",
    },
  },
  {
    name: "isEdit",
    type: "boolean",
    default: "false",
    description: {
      vi: "Chỉ có ở `ButtonSave`: nhãn mặc định \"Lưu thay đổi\" thay vì \"Thêm mới\".",
      en: "`ButtonSave` only: default label \"Lưu thay đổi\" instead of \"Thêm mới\".",
    },
  },
  {
    name: "cooldown",
    type: "number",
    default: "5",
    description: {
      vi: "Chỉ có ở `ButtonRefresh`: số giây khoá sau mỗi lần bấm; `0` để tắt. Tạm dừng khi `loading` / `fetching`.",
      en: "`ButtonRefresh` only: seconds locked after each click; `0` disables. Pauses while `loading` / `fetching`.",
    },
  },
  {
    name: "fetching / label / display",
    type: 'boolean / ReactNode / "icon" | "text" | "auto"',
    default: 'false / "Làm mới" / "auto"',
    description: {
      vi: "Chỉ có ở `ButtonRefresh`: `fetching` xoay icon và khoá nút; `label` làm tooltip (chế độ icon) hoặc nhãn (chế độ text); `display=\"auto\"` theo `showButtonName`.",
      en: "`ButtonRefresh` only: `fetching` spins the icon and locks the button; `label` is the tooltip (icon mode) or text (text mode); `display=\"auto\"` follows `showButtonName`.",
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
