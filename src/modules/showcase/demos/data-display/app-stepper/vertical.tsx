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
  { title: "Khách hàng", description: "Họ tên, CCCD, liên hệ", content: <StepBody>Form khách hàng</StepBody> },
  { title: "Nhu cầu", description: "Dự án, ngân sách", content: <StepBody>Form nhu cầu</StepBody> },
  { title: "Xác nhận", description: "Rà soát và lưu", content: <StepBody>Tóm tắt hồ sơ</StepBody> },
];

/** Nav bên trái, nội dung bên phải; khung hẹp hơn 28rem thì xếp chồng. */
export default function AppStepperVertical() {
  return (
    <AppStepper
      steps={STEPS}
      orientation="vertical"
      variant="inline"
      defaultValue={2}
      completedTone="success"
    />
  );
}
