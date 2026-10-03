import type { ComponentDemo, PropDoc } from "../../types";

import AppCardBasic from "./basic";
import AppCardScrolling from "./scrolling";

export const demos: ComponentDemo[] = [
  {
    id: "basic",
    title: { vi: "Header và hành động", en: "Header and action" },
    description: {
      vi: "`title` nhận chuỗi hoặc node; `action` là cụm nút bên phải. Không khai cái nào thì header biến mất.",
      en: "`title` takes a string or a node, `action` holds the right-side controls; omit both and the header disappears.",
    },
    snippet: `<AppCard title="Ghi chú nội bộ"
  action={<Button variant="outline" size="sm">Thêm ghi chú</Button>}>
  …
</AppCard>`,
    render: AppCardBasic,
    layout: "stack",
  },
  {
    id: "scrolling",
    title: { vi: "Trần chiều cao", en: "Height ceiling" },
    description: {
      vi: "Mặc định body cuộn trong 20rem. Nội dung đã tự giới hạn chiều cao thì dùng `scroll={false}` để bỏ thanh cuộn lồng.",
      en: "The body scrolls within 20rem by default; pass `scroll={false}` when the content already bounds its own height.",
    },
    snippet: `<AppCard title="…" scroll={false} bodyClassName="px-4 py-4">
  …
</AppCard>`,
    render: AppCardScrolling,
    layout: "stack",
  },
];

export const props: PropDoc[] = [
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: { vi: "Nội dung thân card.", en: "Card body content." },
  },
  {
    name: "title",
    type: "ReactNode",
    description: {
      vi: "Chuỗi thì tự bọc `<h3>`; node thì render nguyên văn — tự lo heading nếu cần.",
      en: "Strings are wrapped in an `<h3>`; nodes render as-is, so bring your own heading.",
    },
  },
  {
    name: "action",
    type: "ReactNode",
    description: {
      vi: "Cụm điều khiển bên phải header. Bỏ cả `title` lẫn `action` thì không có header.",
      en: "Controls on the right of the header. Omit both `title` and `action` to drop the header.",
    },
  },
  {
    name: "scroll",
    type: "boolean",
    default: "true",
    description: {
      vi: "Bọc body trong `Scroller` với trần `max-h-80` (20rem). `false` để body cao theo nội dung.",
      en: "Wraps the body in a `Scroller` capped at `max-h-80` (20rem). `false` lets the body grow with its content.",
    },
  },
  {
    name: "bodyClassName",
    type: "string",
    description: {
      vi: "Gắn lên body; dùng để đổi padding mặc định `px-3 py-2`.",
      en: "Applied to the body; use it to change the default `px-3 py-2` padding.",
    },
  },
  {
    name: "className",
    type: "string",
    description: { vi: "Gắn lên `<section>` ngoài cùng.", en: "Applied to the outer `<section>`." },
  },
];
