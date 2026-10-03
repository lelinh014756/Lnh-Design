import type { ComponentDemo } from "../../types";

import NavItemRecursiveNested from "./nested";

export const demos: ComponentDemo[] = [
  {
    id: "nested",
    title: { vi: "Nav nhiều cấp", en: "Nested navigation" },
    description: {
      vi: "Cây nav sinh từ mảng `NavEntry`; thêm tầng là thêm data, không phải sửa render.",
      en: "The tree is derived from a `NavEntry` array — another level is more data, not more rendering code.",
    },
    render: NavItemRecursiveNested,
  },
];
