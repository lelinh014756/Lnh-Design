"use client";

import { AppStepper } from "@/components/data-display/app-stepper";

/** Mỗi bước là một đoạn thanh, nhãn nằm dưới. Hợp với onboarding 3–5 bước. */
export default function AppStepperBar() {
  return (
    <AppStepper
      steps={[{ title: "Thông tin dự án" }, { title: "Phân khu" }, { title: "Sản phẩm" }, { title: "Trình duyệt" }]}
      variant="bar"
      defaultValue={2}
    />
  );
}
