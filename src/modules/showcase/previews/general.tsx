"use client";

import { useState } from "react";

import AppIcon from "@/components/general/app-icon";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { PreviewMap } from "./types";

export const generalPreviews: PreviewMap = {
  button: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Lưu thay đổi</Button>
      <Button variant="outline">Huỷ</Button>
      <Button variant="secondary">Xem lại</Button>
      <Button variant="ghost">Bỏ qua</Button>
      <Button variant="destructive">
        <AppIcon icon="trash" />
        Xoá
      </Button>
      <Button size="sm">
        <AppIcon icon="plus" />
        Thêm
      </Button>
      <Button disabled>
        <Spinner />
        Đang gửi
      </Button>
    </div>
  ),

  toggle: function TogglePreview() {
    const [pressed, setPressed] = useState(true);
    return (
      <div className="flex items-center gap-3">
        <Toggle pressed={pressed} onPressedChange={setPressed}>
          <AppIcon icon="eye" size={16} />
          Hiện cột ẩn
        </Toggle>
        <span className="text-sm text-muted-foreground">
          {pressed ? "Đang hiện" : "Đang ẩn"}
        </span>
      </div>
    );
  },

  "toggle-group": function ToggleGroupPreview() {
    const [value, setValue] = useState("comfortable");
    return (
      <ToggleGroup type="single" value={value} onValueChange={(next) => next && setValue(next)}>
        <ToggleGroupItem value="compact">Chật</ToggleGroupItem>
        <ToggleGroupItem value="comfortable">Vừa</ToggleGroupItem>
        <ToggleGroupItem value="spacious">Rộng</ToggleGroupItem>
      </ToggleGroup>
    );
  },

  kbd: () => (
    <div className="flex flex-col gap-3 text-sm">
      <span className="flex items-center gap-2">
        Mở tìm kiếm
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </span>
      <span className="flex items-center gap-2">
        Thu gọn sidebar
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>B</Kbd>
        </KbdGroup>
      </span>
    </div>
  ),

  spinner: () => (
    <div className="flex items-center gap-6">
      <Spinner />
      <Spinner className="size-6 text-primary" />
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        Đang tải dữ liệu…
      </span>
    </div>
  ),

};
