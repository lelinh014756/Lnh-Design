"use client";

import { useState } from "react";
import AppIcon from "@/components/general/app-icon";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { PreviewMap } from "./types";

export const dataEntryPreviews: PreviewMap = {
  input: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Tên hợp tác xã" />
      <Input defaultValue="Đã điền sẵn" />
      <Input placeholder="Không sửa được" disabled />
      <Input aria-invalid placeholder="Trường bắt buộc" />
    </div>
  ),

  textarea: () => (
    <Textarea
      className="max-w-md"
      rows={4}
      placeholder="Ghi chú nội bộ — ai đọc được trường này cũng thấy nguyên văn."
    />
  ),

  select: function SelectPreview() {
    const [value, setValue] = useState("draft");
    return (
      <div className="flex max-w-xs flex-col gap-2">
        <Label>Trạng thái phiếu</Label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="review">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="archived">Lưu trữ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },

  checkbox: function CheckboxPreview() {
    const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate");
    return (
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          Chọn tất cả dòng trên trang
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox defaultChecked />
          Gửi email khi có thay đổi
        </label>
        <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Checkbox disabled />
          Khoá bởi quản trị viên
        </label>
      </div>
    );
  },

  switch: function SwitchPreview() {
    const [on, setOn] = useState(true);
    return (
      <div className="flex flex-col gap-4">
        <label className="flex items-center justify-between gap-6 text-sm">
          <span className="flex flex-col gap-0.5">
            <span className="font-medium">Cuộn vô hạn</span>
            <span className="text-xs text-muted-foreground">
              Tắt để quay về phân trang cổ điển
            </span>
          </span>
          <Switch checked={on} onCheckedChange={setOn} />
        </label>
      </div>
    );
  },

  slider: function SliderPreview() {
    const [range, setRange] = useState([20, 80]);
    return (
      <div className="flex max-w-sm flex-col gap-3">
        <div className="flex items-baseline justify-between text-sm">
          <Label>Khoảng giá trị</Label>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {range[0]} – {range[1]}
          </span>
        </div>
        <Slider value={range} onValueChange={setRange} max={100} step={1} />
      </div>
    );
  },

  label: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Label htmlFor="preview-label-input">Mã số thuế</Label>
      <Input id="preview-label-input" placeholder="0312345678" />
    </div>
  ),

  field: () => (
    <div className="flex max-w-sm flex-col gap-5">
      <Field>
        <FieldLabel htmlFor="preview-field-ok">Email liên hệ</FieldLabel>
        <Input id="preview-field-ok" placeholder="ban@congty.vn" />
        <FieldDescription>Dùng để nhận thông báo duyệt phiếu.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="preview-field-bad">Số điện thoại</FieldLabel>
        <Input id="preview-field-bad" aria-invalid defaultValue="09" />
        <FieldError>Số điện thoại phải có 10 chữ số.</FieldError>
      </Field>
    </div>
  ),

  "input-group": () => (
    <div className="flex max-w-sm flex-col gap-3">
      <InputGroup>
        <InputGroupAddon>
          <AppIcon icon="search" className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Tìm theo tên hoặc mã" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <AppIcon icon="mail" className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="ban" />
        <InputGroupAddon align="inline-end">@congty.vn</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
