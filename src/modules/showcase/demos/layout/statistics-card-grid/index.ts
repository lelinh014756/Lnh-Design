import type { ComponentDemo, PropDoc } from "../../types";

import StatisticsCardGridDemo from "./grid";

export const demos: ComponentDemo[] = [
  {
    id: "grid",
    title: { vi: "Hàng chỉ số", en: "KPI row" },
    description: {
      vi: "Bốn thẻ trên một hàng ở desktop, tự xuống dòng ở màn hẹp.",
      en: "Four tiles per row on desktop, wrapping on narrow screens.",
    },
    snippet: `<StatisticsCardGrid>
  {STATS.map((stat) => <StatisticsCard key={stat.title} {...stat} />)}
</StatisticsCardGrid>`,
    render: StatisticsCardGridDemo,
    layout: "stack",
  },
];

export const props: PropDoc[] = [
  {
    name: "children",
    type: "ReactNode",
    description: {
      vi: "Các `StatisticsCard`. Bị bỏ qua khi `loading`.",
      en: "The `StatisticsCard` tiles. Ignored while `loading`.",
    },
  },
  {
    name: "loading",
    type: "boolean",
    description: {
      vi: "Render 4 thẻ skeleton cùng `variant` thay cho `children`.",
      en: "Renders 4 skeleton tiles of the same `variant` instead of `children`.",
    },
  },
  {
    name: "variant",
    type: '"default" | "soft"',
    default: '"default"',
    description: {
      vi: "`default`: 1 → 2 (`sm`) → 4 (`xl`) cột theo viewport. `soft`: lưới 2×2 cố định cho trang chủ mobile.",
      en: "`default`: 1 → 2 (`sm`) → 4 (`xl`) columns by viewport. `soft`: fixed 2×2 grid for the mobile home.",
    },
  },
  {
    name: "className",
    type: "string",
    description: {
      vi: "Gắn lên lưới; dùng để đổi `gap` hoặc số cột.",
      en: "Applied to the grid; use it to change `gap` or column counts.",
    },
  },
];
