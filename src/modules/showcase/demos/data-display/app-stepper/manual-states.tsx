"use client";

import { AppStepper, appStepperLabelsVi } from "@/components/data-display/app-stepper";
import { Badge } from "@/components/ui/badge";

/** `completed` cho dữ liệu resume, `error` cho bước cần sửa, `disabled` cho bước chưa mở, `badge` cho nhãn phụ. */
export default function AppStepperManualStates() {
  return (
    <AppStepper
      steps={[
        { title: "Khách hàng", completed: true },
        { title: "Sản phẩm", completed: true },
        { title: "Giấy tờ", error: true, description: "Thiếu ảnh CCCD" },
        {
          title: "Bảo lãnh",
          disabled: true,
          badge: <Badge variant="secondary">Tuỳ chọn</Badge>,
        },
        { title: "Ký duyệt" },
      ]}
      variant="stacked"
      defaultValue={3}
      showStatus
      labels={appStepperLabelsVi}
    />
  );
}
