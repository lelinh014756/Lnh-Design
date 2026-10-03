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
 */
export interface ComponentDemo {
  /** Neo trong trang, cũng là khoá tra source: `${slug}/${id}`. */
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
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
}

export interface DemoModule {
  demos: ComponentDemo[];
}
