"use client";

import { AppStepper } from "@/components/data-display/app-stepper";

const FLOW = [
  { title: "Giữ chỗ" },
  { title: "Đặt cọc" },
  { title: "Ký HĐMB" },
  { title: "Thanh toán" },
  { title: "Bàn giao" },
];

/**
 * Khung hẹp thì nhãn của bước chưa active tự ẩn; ngưỡng tăng theo số bước.
 * Đo theo container chứ không theo viewport, nên đặt trong sheet/dialog vẫn đúng.
 */
export default function AppStepperContainerCollapse() {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-xs rounded-md border border-dashed p-3">
        <AppStepper steps={FLOW} defaultValue={3} />
      </div>
      <AppStepper steps={FLOW} defaultValue={3} />
    </div>
  );
}
