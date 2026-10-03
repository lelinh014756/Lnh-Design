import type { ComponentDemo } from "../../types";

import StatisticsCardBasic from "./basic";
import StatisticsCardDeltas from "./deltas";

export const demos: ComponentDemo[] = [
  {
    id: "basic",
    title: { vi: "Cơ bản", en: "Basic" },
    description: {
      vi: "Giá trị chính + delta + sparkline. Sparkline là tuỳ chọn: bỏ trống thì thẻ co lại, không để khoảng trống.",
      en: "Value, delta and sparkline. The sparkline is optional — omit it and the tile shrinks instead of leaving a gap.",
    },
    render: StatisticsCardBasic,
  },
  {
    id: "deltas",
    title: { vi: "Hướng delta", en: "Delta directions" },
    description: {
      vi: "`up` / `down` / `flat`. Giảm không mặc định là xấu — nhãn đi kèm nói rõ ngữ cảnh.",
      en: "`up` / `down` / `flat`. A drop isn't automatically bad, so the label carries the context.",
    },
    render: StatisticsCardDeltas,
  },
];
