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
  { title: "Tải file", content: <StepBody>Chọn file Excel danh sách căn</StepBody> },
  { title: "Đối chiếu cột", loading: true, content: <StepBody>Đang khớp cột với mẫu nhập</StepBody> },
  { title: "Nhập dữ liệu", content: <StepBody>Xem trước và xác nhận</StepBody> },
];

/** Bản dọc gọn nhất — thanh bên của sheet hoặc màn hình hẹp. */
export default function AppStepperVerticalIndicator() {
  return (
    <AppStepper
      steps={STEPS}
      orientation="vertical"
      variant="indicator"
      defaultValue={2}
      completedTone="success"
    />
  );
}
