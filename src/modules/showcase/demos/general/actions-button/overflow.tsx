"use client";

import { useState } from "react";

import ActionsButton from "@/components/general/actions-button";

/**
 * Quá `maxVisible` thì phần dư gom vào menu "thêm"; item có `group` LUÔN nằm
 * trong menu kèm nhãn nhóm, còn `disabled` giữ item hiển thị và nói rõ lý do.
 */
export default function ActionsButtonOverflow() {
  const [log, setLog] = useState("Bấm thử một hành động");

  return (
    <div className="flex flex-col gap-3">
      <ActionsButton
        name="hợp đồng"
        entityData={{ id: 2048, name: "HD-2048" }}
        maxVisible={2}
        items={[
          { preset: "VIEW", onClick: () => setLog("Xem hợp đồng") },
          { preset: "EDIT", onClick: () => setLog("Sửa hợp đồng") },
          { preset: "PRINT", onClick: () => setLog("In hợp đồng") },
          { preset: "HISTORY", group: "Theo dõi", onClick: () => setLog("Mở lịch sử") },
          { preset: "TRANSFER", group: "Theo dõi", onClick: () => setLog("Chuyển nhượng") },
          {
            preset: "DELETE",
            disabled: true,
            disabledReason: "Hợp đồng đã phát sinh phiếu thu",
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">{log}</p>
    </div>
  );
}
