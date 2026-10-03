import type { ComponentDemo, PropDoc } from "../../types";

import NavItemRecursiveNested from "./nested";

export const demos: ComponentDemo[] = [
  {
    id: "nested",
    title: { vi: "Nav nhiều cấp", en: "Nested navigation" },
    description: {
      vi: "Cây nav sinh từ mảng `NavEntry`; thêm tầng là thêm data, không phải sửa render.",
      en: "The tree is derived from a `NavEntry` array — another level is more data, not more rendering code.",
    },
    snippet: `<SidebarMenu>
  {ENTRIES.map((entry) => <NavItemRecursive key={entry.key} entry={entry} />)}
</SidebarMenu>`,
    render: NavItemRecursiveNested,
  },
];

export const props: PropDoc[] = [
  {
    name: "entry",
    type: "NavEntry | NavGroupChild",
    required: true,
    description: {
      vi: "`link`, `group`, `subgroup` hoặc `divider`. Nhánh chứa route đang mở tự bung; link `readiness: \"none\"` hiện nhưng không bấm được.",
      en: "`link`, `group`, `subgroup` or `divider`. The branch holding the current route opens itself; `readiness: \"none\"` links render disabled.",
    },
  },
  {
    name: "onNavigate",
    type: "() => void",
    description: {
      vi: "Gọi khi bấm một link — ví dụ để đóng sidebar trên mobile.",
      en: "Called when a link is clicked — e.g. to close the mobile sidebar.",
    },
  },
  {
    name: "resolveLabel",
    type: "(labelKey: string) => string",
    default: "labelKey => labelKey",
    description: {
      vi: "Tra nhãn từ `labelKey` (thường qua i18n). Bỏ trống thì hiện nguyên `labelKey`.",
      en: "Resolves `labelKey` to a label (usually via i18n). Omit it and `labelKey` shows verbatim.",
    },
  },
  {
    name: "labels",
    type: "{ readinessNone: string }",
    default: '{ readinessNone: "Screen not built yet" }',
    description: {
      vi: "Tooltip cho mục chưa dựng màn hình.",
      en: "Tooltip for entries whose screen isn't built yet.",
    },
  },
];
