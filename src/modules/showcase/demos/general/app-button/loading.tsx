"use client";

import { useState } from "react";

import AppButton, { ButtonAdd, ButtonSave } from "@/components/general/app-button";

/**
 * `loading` khoá nút và đổi nhãn — người dùng không bấm chồng lệnh, và biết
 * hệ thống đang làm gì chứ không chỉ thấy một spinner không tên. Nút chỉ có
 * icon thì chỉ hiện spinner.
 */
export default function AppButtonLoading() {
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1800);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonSave isEdit loading={saving} loadingText="Đang lưu…" onClick={save} />
      <AppButton size="icon" variant="outline" icon="download" loading={saving} aria-label="Tải bảng giá" />
      <ButtonAdd disabled>Hết quyền thêm</ButtonAdd>
      <span className="text-sm text-muted-foreground">
        {saving ? "Nút bị khoá tới khi xong" : "Bấm Lưu để xem trạng thái"}
      </span>
    </div>
  );
}
