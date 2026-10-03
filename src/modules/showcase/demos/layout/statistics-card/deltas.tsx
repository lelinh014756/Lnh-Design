"use client";

import StatisticsCard from "@/components/layout/statistics-card";

/** Ba hướng delta: tăng, giảm, đứng yên — mỗi hướng một màu và một icon. */
export default function StatisticsCardDeltas() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatisticsCard
        title="Lượt cài"
        value="1.284"
        icon="package"
        delta={{ value: 8.4, direction: "up", label: "30 ngày" }}
      />
      <StatisticsCard
        title="Item nội bộ"
        value="3"
        icon="lock"
        delta={{ value: 2, direction: "down", label: "đã công khai bớt" }}
      />
      <StatisticsCard
        title="Repo dùng"
        value="6"
        icon="box"
        delta={{ value: 0, direction: "flat", label: "không đổi" }}
      />
    </div>
  );
}
