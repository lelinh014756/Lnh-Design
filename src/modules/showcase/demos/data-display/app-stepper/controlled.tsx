"use client";

import { useState, type ReactNode } from "react";

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
  { title: "Khách hàng", content: <StepBody>Họ tên, CCCD, liên hệ</StepBody> },
  { title: "Sản phẩm", content: <StepBody>Căn hộ, giá bán</StepBody> },
  { title: "Thanh toán", content: <StepBody>Tiến độ, đợt thu</StepBody> },
  { title: "Ký duyệt", content: <StepBody>Duyệt nội bộ</StepBody> },
];

/** Parent giữ `value`; `onValueChange` chỉ bắn khi thực sự chuyển bước. */
export default function AppStepperControlled() {
  const [step, setStep] = useState(2);

  return (
    <div className="flex flex-col gap-3">
      <AppStepper
        steps={STEPS}
        variant="indicator"
        value={step}
        onValueChange={setStep}
        controls="buttons"
        completedTone="success"
        showCompletedIcon={false}
        labels={appStepperLabelsVi}
      />
      <p className="font-mono text-[0.6875rem] text-muted-foreground">parent state: step = {step}</p>
    </div>
  );
}
