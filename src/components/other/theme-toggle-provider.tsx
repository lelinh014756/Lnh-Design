"use client";

import type { ComponentProps } from "react";

import { ThemeProvider } from "@/components/ui/theme-provider";

/**
 * Provider sáng/tối cấp app.
 *
 * Chỉ là một lớp mỏng đặt sẵn cấu hình mặc định của hệ thống lên
 * `ui/theme-provider`: `attribute="class"` để khớp `@custom-variant dark` khai
 * trong `globals.css`, và `disableTransitionOnChange` để đảo theme không kéo
 * theo một lượt transition trên mọi phần tử đang hiện.
 *
 * Nhóm "Other" của Ant Design là chỗ cho những thứ không phải widget: provider,
 * context, tiện ích cấp cây. Đặt ở đây thay vì `general/` để 7 nhóm giữ đúng
 * nghĩa gốc.
 */
export function ThemeToggleProvider(props: ComponentProps<typeof ThemeProvider>) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props} />;
}

export default ThemeToggleProvider;
