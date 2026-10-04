"use client";

import { AppStepper } from "@/components/data-display/app-stepper";

const STEPS = [{ title: "Khách hàng" }, { title: "Nhu cầu" }, { title: "Xác nhận" }];

/** `sm` / `md` / `lg` đổi đường kính vòng, cỡ icon và cỡ tiêu đề; vị trí đường nối tự tính theo biến CSS. */
export default function AppStepperSizes() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <AppStepper key={size} steps={STEPS} size={size} defaultValue={2} />
      ))}
    </div>
  );
}
