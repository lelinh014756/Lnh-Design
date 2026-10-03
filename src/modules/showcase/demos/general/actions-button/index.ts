import type { ComponentDemo, PropDoc } from "../../types";

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
    snippet: `<ActionsButton name="lô đất" entityData={row}
  items={[{ preset: "VIEW" }, { preset: "EDIT" },
    { preset: "DELETE", confirm: { description } }]} />`,
    render: ActionsButtonRowActions,
  },
  {
    id: "overflow",
    title: { vi: "Tràn menu và item bị chặn", en: "Overflow and blocked items" },
    description: {
      vi: "`maxVisible` quyết định bao nhiêu nút ở ngoài; `group` đẩy item vào menu kèm nhãn; `disabled` giữ item lại và nói lý do.",
      en: "`maxVisible` caps the outside buttons, `group` pushes items into the labelled menu, `disabled` keeps an item visible with its reason.",
    },
    snippet: `<ActionsButton maxVisible={2} items={[
  { preset: "HISTORY", group: "Theo dõi" },
  { preset: "DELETE", disabled: true, disabledReason }]} />`,
    render: ActionsButtonOverflow,
  },
];

export const props: PropDoc[] = [
  {
    name: "items",
    type: "ActionItem[]",
    required: true,
    description: {
      vi: "preset, id, title, icon, variant, enabled, disabled, disabledReason, onClick, showTitle, confirm, group, cluster, needsNote, noteLabel, noteRequired",
      en: "preset, id, title, icon, variant, enabled, disabled, disabledReason, onClick, showTitle, confirm, group, cluster, needsNote, noteLabel, noteRequired",
    },
  },
  {
    name: "name",
    type: "string",
    required: true,
    description: {
      vi: "Loại đối tượng, ghép vào câu xác nhận: \"Xoá lô đất A12?\"",
      en: "Entity type, used in the confirm sentence: \"Delete plot A12?\"",
    },
  },
  {
    name: "entityData",
    type: "{ id: number | string; name: string }",
    description: {
      vi: "Bản ghi đang thao tác; `name` là phần sau loại đối tượng trong câu xác nhận.",
      en: "The record being acted on; `name` follows the entity type in the confirm sentence.",
    },
  },
  {
    name: "maxVisible",
    type: "number",
    default: "3",
    description: {
      vi: "Số nút hiện ngoài; phần dư gom vào menu \"thêm\". Item có `group` luôn nằm trong menu.",
      en: "Buttons shown inline; the rest go into the \"more\" menu. Items with `group` always live in the menu.",
    },
  },
  {
    name: "isLoading",
    type: "boolean",
    default: "false",
    description: {
      vi: "Khoá toàn bộ nút và menu trong lúc chờ.",
      en: "Disables every button and the menu while pending.",
    },
  },
  {
    name: "moreTitle",
    type: "string",
    description: {
      vi: "Tooltip của nút menu \"thêm\"; mặc định lấy từ i18n.",
      en: "Tooltip for the \"more\" menu button; defaults to the i18n label.",
    },
  },
  {
    name: "className",
    type: "string",
    description: { vi: "Gắn lên khung ngoài.", en: "Applied to the outer wrapper." },
  },
];
