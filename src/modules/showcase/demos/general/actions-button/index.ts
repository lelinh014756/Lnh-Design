import type { ComponentDemo } from "../../types";

import ActionsButtonOverflow from "./overflow";
import ActionsButtonRowActions from "./row-actions";

export const demos: ComponentDemo[] = [
  {
    id: "row-actions",
    title: { vi: "Hành động trên dòng", en: "Row actions" },
    description: {
      vi: "Ba hành động quen thuộc; hành động nguy hiểm đi kèm `confirm` nên không thể lỡ tay.",
      en: "Three familiar actions; the destructive one carries a `confirm` so it can't fire by accident.",
    },
    render: ActionsButtonRowActions,
  },
  {
    id: "overflow",
    title: { vi: "Tràn menu và item bị chặn", en: "Overflow and blocked items" },
    description: {
      vi: "`maxVisible` quyết định bao nhiêu nút ở ngoài; `group` đẩy item vào menu kèm nhãn; `disabled` giữ item lại và nói lý do.",
      en: "`maxVisible` caps the outside buttons, `group` pushes items into the labelled menu, `disabled` keeps an item visible with its reason.",
    },
    render: ActionsButtonOverflow,
  },
];
