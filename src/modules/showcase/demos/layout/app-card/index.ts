import type { ComponentDemo } from "../../types";

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
    render: AppCardBasic,
  },
  {
    id: "scrolling",
    title: { vi: "Trần chiều cao", en: "Height ceiling" },
    description: {
      vi: "Mặc định body cuộn trong 20rem. Nội dung đã tự giới hạn chiều cao thì dùng `scroll={false}` để bỏ thanh cuộn lồng.",
      en: "The body scrolls within 20rem by default; pass `scroll={false}` when the content already bounds its own height.",
    },
    render: AppCardScrolling,
  },
];
