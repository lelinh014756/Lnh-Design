"use client";

import { useState } from "react";

import { ButtonRefresh } from "@/components/general/app-button";

/**
 * Sau mỗi lần bấm, nút khoá và đếm ngược `cooldown` giây. Trong lúc `fetching`
 * icon xoay và đếm ngược tạm dừng — một lần tải chậm không cộng dồn thời gian khoá.
 */
export default function AppButtonRefresh() {
  const [fetching, setFetching] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const refresh = () => {
    setFetching(true);
    setTimeout(() => {
      setFetching(false);
      setUpdatedAt(new Date().toLocaleTimeString("vi-VN"));
    }, 1200);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonRefresh fetching={fetching} onClick={refresh} />
      <ButtonRefresh display="text" label="Tải lại bảng giá" cooldown={8} fetching={fetching} onClick={refresh} />
      <span className="text-sm text-muted-foreground">
        {updatedAt ? `Cập nhật lúc ${updatedAt}` : "Chưa tải lại lần nào"}
      </span>
    </div>
  );
}
