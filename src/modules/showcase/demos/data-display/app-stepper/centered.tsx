"use client";

import { AppStepper } from "@/components/data-display/app-stepper";

/** Nhãn căn giữa dưới indicator. Khung hẹp hơn 28rem thì mô tả tự ẩn (vẫn đọc được bằng screen reader). */
export default function AppStepperCentered() {
  return (
    <AppStepper
      steps={[
        { title: "Khách hàng", description: "Họ tên, CCCD" },
        { title: "Nhu cầu", description: "Dự án, ngân sách" },
        { title: "Xác nhận", description: "Rà soát và lưu" },
      ]}
      variant="centered"
      defaultValue={2}
    />
  );
}
