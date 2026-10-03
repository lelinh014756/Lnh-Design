import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  // Khung xem trước không phải nội dung để tìm thấy qua công cụ tìm kiếm —
  // nó là một mảnh của trang khác.
  robots: { index: false, follow: false },
};

/**
 * Layout của khung xem trước — cố tình trống.
 *
 * Không header, không sidebar, không provider thừa: mọi thứ bọc thêm ở đây đều
 * làm demo hiển thị khác với lúc người dùng cài về repo của họ, và đó đúng là
 * thứ trang này tồn tại để chứng minh ngược lại.
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return children;
}
