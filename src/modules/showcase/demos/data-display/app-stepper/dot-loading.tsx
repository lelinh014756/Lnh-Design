"use client";

import { AppStepper } from "@/components/data-display/app-stepper";

/** `marker="dot"`: bước đang làm có chấm giữa; `loading` chỉ hiện khi bước đó active. */
export default function AppStepperDotLoading() {
  return (
    <AppStepper
      steps={[{ title: "Tải file" }, { title: "Đối chiếu cột", loading: true }, { title: "Nhập dữ liệu" }]}
      variant="indicator"
      marker="dot"
      size="sm"
      defaultValue={2}
      completedTone="success"
    />
  );
}
