"use client";

import { toast } from "sonner";

import { ButtonIntent } from "@/components/general/app-button";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * `needsConfirm` chặn cú bấm bằng hộp xác nhận; `onConfirm` chỉ chạy khi bấm
 * "Xoá". Handler async thì hộp giữ spinner và không đóng được tới khi xong.
 */
export default function AppButtonConfirm() {
  return (
    <ButtonIntent
      intent="destructive"
      variant="outline"
      icon="trash-2"
      needsConfirm
      confirmTitle="Xoá căn A12-05?"
      confirmDescription="Căn đã phát sinh phiếu thu sẽ không xoá được — kiểm tra lại trước khi xác nhận."
      confirmLabel="Xoá"
      loadingText="Đang xoá…"
      onConfirm={async () => {
        await delay(1200);
        toast.success("Đã xoá căn A12-05");
      }}
    >
      Xoá căn
    </ButtonIntent>
  );
}
