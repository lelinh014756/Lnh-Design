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
  { title: "Khách hàng", content: <StepBody>Form khách hàng</StepBody> },
  { title: "Nhu cầu", content: <StepBody>Form nhu cầu</StepBody> },
  { title: "Xác nhận", content: <StepBody>Tóm tắt hồ sơ</StepBody> },
];

/** Không có mô tả — khoảng cách giữa các bước vẫn giữ đều. */
export default function AppStepperVerticalTitles() {
  return <AppStepper steps={STEPS} orientation="vertical" defaultValue={2} completedTone="success" />;
}
