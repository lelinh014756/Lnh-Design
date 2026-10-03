import type { ComponentType } from "react";

import type { LocalizedText } from "@/config/catalog";

/**
 * Một ví dụ trên trang component.
 *
 * Luật cho file demo:
 * 1. Mỗi demo MỘT file — `demos/{nhóm}/{slug}/{id}.tsx`. Đó cũng là cách tab
 *    "Mã nguồn" lấy source: đọc nguyên văn file, không cắt theo marker (marker
 *    lệch sau vài lần sửa, nội dung file thì không).
 * 2. Chỉ import từ `@/components/*` và gói đã có trong `package.json` — source
 *    đi thẳng cho người dùng copy, import vào thứ họ không có là đưa họ vào ngõ cụt.
 * 3. KHÔNG tự mount `TooltipProvider`/`Toaster`: trang đã mount sẵn, mount chồng
 *    là hai lớp portal cùng bắt phím.
 * 4. Overlay (dialog, sheet, drawer) phải mở bằng nút, không `defaultOpen` —
 *    demo tự bung che cả trang khi người dùng mới chỉ cuộn ngang qua.
 * 5. Demo dùng breakpoint viewport (`md:`/`xl:grid-cols-*`) hoặc cần bề ngang
 *    lớn phải khai `layout: "stack"` — ở bố cục hàng, khung demo chỉ còn phần
 *    bên phải cột mô tả nhưng media query vẫn đọc theo cửa sổ.
 */
export interface ComponentDemo {
  /** Neo trong trang, cũng là khoá tra source: `${slug}/${id}`. */
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  /**
   * Lời gọi rút gọn hiện dưới mô tả — viết tay, tối đa ~4 dòng, chỉ prop chính.
   * Mã đầy đủ vẫn lấy nguyên văn từ file qua nút "Xem mã nguồn".
   */
  snippet?: string;
  /**
   * Component chứ không phải element: mỗi demo giữ state riêng và phải remount
   * sạch khi bấm tải lại — một element dựng sẵn thì không.
   */
  render: ComponentType;
  /**
   * `frame` = render trong iframe qua `/preview/[name]?demo=`. Chỉ dùng cho demo
   * phụ thuộc bề rộng THẬT (sidebar, navigation menu): render thẳng trong trang
   * thì media query của demo đọc theo cửa sổ, không theo khung.
   */
  mode?: "inline" | "frame";
  /**
   * `row` = mô tả bên trái, demo bên phải (khi khung đủ rộng); `stack` = mô tả
   * trên, demo chiếm nguyên bề ngang. Mặc định: `frame` → `stack`, còn lại → `row`.
   */
  layout?: "row" | "stack";
}

/** Một dòng trong bảng Props. Viết tay để ghi chú có đủ hai ngôn ngữ. */
export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: LocalizedText;
}

export interface DemoModule {
  demos: ComponentDemo[];
  props?: PropDoc[];
}
