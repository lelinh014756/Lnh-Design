import type { ComponentDemo, PropDoc } from "../../types";

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
    snippet: `<StatisticsCard title="Component" value="35" icon="component"
  delta={{ value: 12, direction: "up", label: "so với quý trước" }}
  sparkline={[18, 21, 24, 27, 30, 33, 35]} />`,
    render: StatisticsCardBasic,
  },
  {
    id: "deltas",
    title: { vi: "Hướng delta", en: "Delta directions" },
    description: {
      vi: "`up` / `down` / `flat`. Giảm không mặc định là xấu — nhãn đi kèm nói rõ ngữ cảnh.",
      en: "`up` / `down` / `flat`. A drop isn't automatically bad, so the label carries the context.",
    },
    snippet: `<StatisticsCard title="Item nội bộ" value="3" icon="lock"
  delta={{ value: 2, direction: "down", label: "đã công khai bớt" }} />`,
    render: StatisticsCardDeltas,
  },
];

export const props: PropDoc[] = [
  {
    name: "title",
    type: "string",
    required: true,
    description: { vi: "Nhãn chỉ số.", en: "Metric label." },
  },
  {
    name: "value",
    type: "string",
    required: true,
    description: {
      vi: "Giá trị đã định dạng sẵn (\"1.284\") — thẻ không tự format số.",
      en: "Pre-formatted value (\"1,284\") — the card doesn't format numbers.",
    },
  },
  {
    name: "icon",
    type: "IconName",
    description: {
      vi: "Huy hiệu góc phải (`default`) hoặc ô icon bên trái (`soft`).",
      en: "Corner badge (`default`) or leading icon tile (`soft`).",
    },
  },
  {
    name: "delta",
    type: '{ value: number; direction: "up" | "down" | "flat"; label?: string }',
    description: {
      vi: "`direction` chỉ đổi icon mũi tên; màu lấy từ `tone`, không suy từ hướng.",
      en: "`direction` only changes the arrow icon; color comes from `tone`, not from the direction.",
    },
  },
  {
    name: "sparkline",
    type: "number[]",
    description: {
      vi: "Cần ít nhất 2 điểm. Chỉ hiện ở `variant=\"default\"`.",
      en: "Needs at least 2 points. Only rendered for `variant=\"default\"`.",
    },
  },
  {
    name: "tone",
    type: '"neutral" | "success" | "danger" | "warning" | "info"',
    default: '"neutral"',
    description: {
      vi: "Màu của delta, sparkline và huy hiệu icon.",
      en: "Color of the delta, sparkline and icon badge.",
    },
  },
  {
    name: "bgClass",
    type: "string",
    description: {
      vi: "Ghi đè nền huy hiệu icon thay cho màu theo `tone`.",
      en: "Overrides the icon badge background instead of the `tone` color.",
    },
  },
  {
    name: "hint",
    type: "string",
    description: {
      vi: "Dòng chú thích dưới cùng; chỉ có ở `variant=\"default\"`.",
      en: "Footnote line; `variant=\"default\"` only.",
    },
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: {
      vi: "Hiện skeleton; giữ chỗ cho sparkline và hint nếu đã khai để layout không nhảy.",
      en: "Shows a skeleton, keeping space for the sparkline and hint when provided so the layout doesn't jump.",
    },
  },
  {
    name: "variant",
    type: '"default" | "soft"',
    default: '"default"',
    description: {
      vi: "`soft`: thẻ trang chủ mobile — nền nhạt, icon bên trái, không sparkline.",
      en: "`soft`: mobile home tile — tinted background, leading icon, no sparkline.",
    },
  },
  {
    name: "className",
    type: "string",
    description: { vi: "Gắn lên `<article>` ngoài cùng.", en: "Applied to the outer `<article>`." },
  },
];
