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

/** Bố cục mặc định: indicator và nhãn cùng hàng, đường nối co giãn giữa các bước. Có hoặc không có mô tả. */
export default function AppStepperInline() {
  return (
    <div className="flex flex-col gap-8">
      <AppStepper steps={STEPS.map(({ title }) => ({ title }))} defaultValue={2} />
      <AppStepper steps={STEPS} defaultValue={2} />
    </div>
  );
}
