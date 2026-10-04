"use client";

import AppButton from "@/components/general/app-button";

/** `asChild` mượn kiểu nút cho phần tử khác (link điều hướng). Khi đó chỉ render `children` — `Slot` nhận đúng một phần tử. */
export default function AppButtonAsChild() {
  return (
    <AppButton asChild variant="outline">
      <a href="#props">Xem bảng Props</a>
    </AppButton>
  );
}
