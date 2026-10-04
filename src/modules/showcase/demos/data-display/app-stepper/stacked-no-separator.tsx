"use client";

import { AppStepper } from "@/components/data-display/app-stepper";

/** Indicator trên, tiêu đề dưới căn trái. Tắt đường nối khi các bước chỉ là mốc tham chiếu. */
export default function AppStepperStackedNoSeparator() {
  return (
    <AppStepper
      steps={[{ title: "Thông tin dự án" }, { title: "Phân khu" }, { title: "Sản phẩm" }, { title: "Trình duyệt" }]}
      variant="stacked"
      defaultValue={2}
      showSeparator={false}
    />
  );
}
