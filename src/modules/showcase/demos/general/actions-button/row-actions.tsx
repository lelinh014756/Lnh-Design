"use client";

import { useState } from "react";

import ActionsButton from "@/components/general/actions-button";

/**
 * Cụm hành động trên một dòng bảng: tối đa 3 nút viền, phần dư tự vào menu.
 * `confirm` bật hộp xác nhận trước khi gọi `onClick`.
 */
export default function ActionsButtonRowActions() {
  const [log, setLog] = useState("Chưa có hành động nào");

  return (
    <div className="flex flex-col gap-3">
      {/* `name` là LOẠI đối tượng, `entityData.name` là tên bản ghi — mẫu câu
          xác nhận ghép hai thứ đó lại: "Xoá lô đất A12?" */}
      <ActionsButton
        name="lô đất"
        entityData={{ id: 12, name: "A12" }}
        items={[
          { preset: "VIEW", onClick: () => setLog("Đã mở chi tiết") },
          { preset: "EDIT", onClick: () => setLog("Đã mở form sửa") },
          {
            preset: "DELETE",
            confirm: { description: "Lô đất đã bán không xoá được — kiểm tra lại trước khi xác nhận." },
            onClick: () => setLog("Đã xoá"),
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">{log}</p>
    </div>
  );
}
