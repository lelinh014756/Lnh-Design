"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

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

/** Thanh tiến độ liền khối, link Quay lại ẩn ở bước đầu, counter "N / tổng". Bấm từng đoạn để nhảy bước. */
export default function AppStepperProgressCompact() {
  return (
    <AppStepper
      steps={STEPS}
      variant="progress"
      controls="compact"
      labels={appStepperLabelsVi}
      onComplete={() => {
        toast.success("Đã gửi hồ sơ hợp đồng");
      }}
    />
  );
}
