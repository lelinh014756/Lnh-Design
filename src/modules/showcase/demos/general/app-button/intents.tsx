"use client";

import AppButton from "@/components/general/app-button";

/** `intent` cho màu theo trạng thái, `icon` ghi đè icon của preset. */
export default function AppButtonIntents() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AppButton intent="success">Duyệt</AppButton>
      <AppButton intent="warning">Tạm giữ</AppButton>
      <AppButton intent="destructive">Từ chối</AppButton>
      <AppButton intent="info">Xem log</AppButton>
      <AppButton icon="shield-check">Xác minh</AppButton>
    </div>
  );
}
