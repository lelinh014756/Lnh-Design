"use client";

import {
  ButtonAdd,
  ButtonCancel,
  ButtonConfirm,
  ButtonEdit,
  ButtonSave,
  ButtonSend,
} from "@/components/general/app-button";

/** Họ nút đặt sẵn icon và kiểu cho hành động lặp đi lặp lại trong admin — khỏi ráp lại từng lần. */
export default function AppButtonFamily() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonAdd>Thêm căn</ButtonAdd>
      <ButtonSave />
      <ButtonSave isEdit />
      <ButtonEdit variant="outline">Sửa</ButtonEdit>
      <ButtonSend variant="outline">Gửi duyệt</ButtonSend>
      <ButtonConfirm variant="secondary">Xác nhận</ButtonConfirm>
      <ButtonCancel />
    </div>
  );
}
