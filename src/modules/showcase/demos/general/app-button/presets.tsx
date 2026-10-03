"use client";

import AppButton from "@/components/general/app-button";

/** Preset gắn sẵn icon + màu cho các hành động lặp đi lặp lại trong admin. */
export default function AppButtonPresets() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AppButton preset="add">Thêm mới</AppButton>
      <AppButton preset="edit">Sửa</AppButton>
      <AppButton preset="save">Lưu</AppButton>
      <AppButton preset="filter">Bộ lọc</AppButton>
      <AppButton preset="excel">Xuất Excel</AppButton>
      <AppButton preset="gradient">Nâng cấp</AppButton>
    </div>
  );
}
