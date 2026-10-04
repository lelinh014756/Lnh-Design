"use client";

import type { ReactNode } from "react";

import { AppStepper, type AppStepperStep } from "@/components/data-display/app-stepper";

function StepBody({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed px-4 py-6 text-center text-xs leading-5 text-muted-foreground">
      {children}
    </div>
  );
}

const STEPS: AppStepperStep[] = [
  { title: "Khách hàng", content: <StepBody>Họ tên, CCCD, liên hệ</StepBody> },
  { title: "Sản phẩm", content: <StepBody>Căn hộ, giá bán</StepBody> },
  { title: "Thanh toán", content: <StepBody>Tiến độ, đợt thu</StepBody> },
  { title: "Ký duyệt", content: <StepBody>Duyệt nội bộ</StepBody> },
];

/** Chỉ vòng số và đường nối; tiêu đề vẫn thành `aria-label` của từng bước. */
export default function AppStepperIndicator() {
  return (
    <AppStepper
      steps={STEPS}
      variant="indicator"
      defaultValue={2}
      completedTone="success"
      showCompletedIcon={false}
    />
  );
}
