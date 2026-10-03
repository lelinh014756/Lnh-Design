"use client";

import StatisticsCard from "@/components/layout/statistics-card";

/** Thẻ chỉ số: giá trị chính, delta so với kỳ trước, sparkline xu hướng. */
export default function StatisticsCardBasic() {
  return (
    <div className="max-w-xs">
      <StatisticsCard
        title="Component"
        value="35"
        icon="component"
        delta={{ value: 12, direction: "up", label: "so với quý trước" }}
        sparkline={[18, 21, 24, 27, 30, 33, 35]}
      />
    </div>
  );
}
