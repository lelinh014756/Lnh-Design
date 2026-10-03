import type { ComponentDemo } from "../../types";

import StatisticsCardGridDemo from "./grid";

export const demos: ComponentDemo[] = [
  {
    id: "grid",
    title: { vi: "Hàng chỉ số", en: "KPI row" },
    description: {
      vi: "Bốn thẻ trên một hàng ở desktop, tự xuống dòng ở màn hẹp.",
      en: "Four tiles per row on desktop, wrapping on narrow screens.",
    },
    render: StatisticsCardGridDemo,
  },
];
