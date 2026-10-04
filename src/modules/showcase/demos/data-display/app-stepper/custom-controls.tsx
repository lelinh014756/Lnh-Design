"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import { AppStepper, type AppStepperStep } from "@/components/data-display/app-stepper";
import { Button } from "@/components/ui/button";

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
];

/** `renderControls` nhận api (`next`/`prev`/`goTo` trả `Promise<boolean>`) — thêm Lưu nháp hoặc xếp nút theo layout dialog. */
export default function AppStepperCustomControls() {
  return (
    <AppStepper
      steps={STEPS}
      variant="bar"
      onComplete={() => {
        toast.success("Đã gửi hồ sơ");
      }}
      renderControls={(api) => (
        <div className="flex flex-wrap items-center gap-2 border-t pt-4">
          <Button variant="ghost" size="lg" onClick={() => toast.info("Đã lưu nháp")}>
            Lưu nháp
          </Button>
          <span className="ms-auto text-xs text-muted-foreground tabular-nums">
            {api.step}/{api.total}
          </span>
          <Button variant="outline" size="lg" disabled={api.isFirst || api.isPending} onClick={api.prev}>
            Quay lại
          </Button>
          <Button size="lg" disabled={api.isPending || api.isFinished} onClick={() => void api.next()}>
            {api.isLast ? "Gửi hồ sơ" : "Tiếp"}
          </Button>
        </div>
      )}
    />
  );
}
