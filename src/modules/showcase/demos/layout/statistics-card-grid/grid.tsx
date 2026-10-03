"use client";

import StatisticsCard from "@/components/layout/statistics-card";
import { StatisticsCardGrid } from "@/components/layout/statistics-card-grid";

const STATS = [
  {
    title: "Component",
    value: "35",
    icon: "component" as const,
    delta: { value: 12, direction: "up" as const, label: "so với quý trước" },
    sparkline: [18, 21, 24, 27, 30, 33, 35],
  },
  {
    title: "Lượt cài",
    value: "1.284",
    icon: "package" as const,
    delta: { value: 8.4, direction: "up" as const, label: "30 ngày" },
    sparkline: [820, 910, 940, 1010, 1105, 1190, 1284],
  },
  {
    title: "Repo dùng",
    value: "6",
    icon: "box" as const,
    delta: { value: 0, direction: "flat" as const, label: "không đổi" },
  },
  {
    title: "Item nội bộ",
    value: "3",
    icon: "lock" as const,
    delta: { value: 2, direction: "down" as const, label: "đã công khai bớt" },
  },
];

/** Lưới tự xuống dòng theo breakpoint — không phải khai lại `grid-cols` mỗi trang. */
export default function StatisticsCardGridDemo() {
  return (
    <StatisticsCardGrid>
      {STATS.map((stat) => (
        <StatisticsCard key={stat.title} {...stat} />
      ))}
    </StatisticsCardGrid>
  );
}
