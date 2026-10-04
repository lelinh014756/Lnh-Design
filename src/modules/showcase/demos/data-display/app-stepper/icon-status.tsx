"use client";

import type { ReactNode } from "react";

import {
  AppStepper,
  appStepperLabelsVi,
  type AppStepperStep,
} from "@/components/data-display/app-stepper";

function StepBody({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed px-4 py-6 text-center text-xs leading-5 text-muted-foreground">
      {children}
    </div>
  );
}

const STEPS: AppStepperStep[] = [
  { title: "Khách hàng", icon: "user", content: <StepBody>Họ tên, CCCD, liên hệ</StepBody> },
  { title: "Thanh toán", icon: "wallet", content: <StepBody>Tiến độ, đợt thu</StepBody> },
  { title: "Xác thực OTP", icon: "shield-check", content: <StepBody>Mã gửi qua SMS</StepBody> },
];

/**
 * Icon riêng từng bước, dòng "Bước N" và badge trạng thái tự đổi. Mọi chuỗi
 * hiển thị đi vào bằng `labels` — component không đọc từ điển của app.
 */
export default function AppStepperIconStatus() {
  return (
    <AppStepper
      steps={STEPS}
      variant="stacked"
      size="lg"
      defaultValue={2}
      showStepLabel
      showStatus
      completedTone="success"
      controls="buttons"
      labels={appStepperLabelsVi}
    />
  );
}
