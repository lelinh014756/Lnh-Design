"use client";

import { useState } from "react";

import AppButton from "@/components/general/app-button";

/**
 * `loading` khoá nút và đổi nhãn — người dùng không bấm chồng lệnh, và biết
 * hệ thống đang làm gì chứ không chỉ thấy một spinner không tên.
 */
export default function AppButtonLoading() {
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1800);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <AppButton preset="save" loading={saving} loadingText="Đang lưu…" onClick={save}>
        Lưu thay đổi
      </AppButton>
      <AppButton preset="add" disabled>
        Hết quyền thêm
      </AppButton>
      <span className="text-sm text-muted-foreground">
        {saving ? "Nút bị khoá tới khi xong" : "Bấm Lưu để xem trạng thái"}
      </span>
    </div>
  );
}
