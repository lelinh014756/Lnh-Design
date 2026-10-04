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
  { title: "Khách hàng", content: <StepBody>Bấm Tiếp tục — máy chủ sẽ trả lỗi</StepBody> },
  { title: "Nhu cầu", content: <StepBody>Không tới được bước này</StepBody> },
  { title: "Xác nhận", content: <StepBody>Không tới được bước này</StepBody> },
];

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Lỗi ném từ `beforeNext` / `onComplete` được bắt: không chuyển bước, chuyển cho `onError`. */
export default function AppStepperGuardError() {
  return (
    <AppStepper
      steps={STEPS}
      controls="buttons"
      labels={appStepperLabelsVi}
      beforeNext={async () => {
        await delay(500);
        throw new Error("Máy chủ không phản hồi (504)");
      }}
      onError={(error, step) =>
        toast.error(`Không thể rời bước ${step}`, {
          description: error instanceof Error ? error.message : undefined,
        })
      }
    />
  );
}
