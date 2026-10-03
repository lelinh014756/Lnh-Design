/**
 * Cấu hình đổi giao diện: kiểu nền sidebar.
 *
 * Giá trị đi vào thuộc tính `data-sidebar-style` trên `<html>` — tra cứu quy
 * tắc trong `src/app/globals.css`. File này chỉ giữ danh sách giá trị hợp lệ
 * + nhãn, dùng chung giữa store (`src/store/appearance-store.ts`), picker
 * (`src/components/data-entry/appearance-picker.tsx`) và trang `/tokens`.
 *
 * Không có chiều "màu thương hiệu": AureCook chỉ có một brand duy nhất, token
 * màu khai một lần ở `:root`/`.dark`.
 */

export const SIDEBAR_STYLES = ["default", "solid", "gradient", "tint"] as const;
export type SidebarStyle = (typeof SIDEBAR_STYLES)[number];

export const SIDEBAR_STYLE_OPTIONS: Record<
  SidebarStyle,
  { labelKey: string; descriptionKey: string }
> = {
  default: { labelKey: "sidebarStyleDefault", descriptionKey: "sidebarStyleDefaultHint" },
  solid: { labelKey: "sidebarStyleSolid", descriptionKey: "sidebarStyleSolidHint" },
  gradient: { labelKey: "sidebarStyleGradient", descriptionKey: "sidebarStyleGradientHint" },
  tint: { labelKey: "sidebarStyleTint", descriptionKey: "sidebarStyleTintHint" },
};

export const DEFAULT_SIDEBAR_STYLE: SidebarStyle = "default";

export const APPEARANCE_STORAGE_KEY = "aurecook-appearance";

export function isSidebarStyle(value: unknown): value is SidebarStyle {
  return typeof value === "string" && (SIDEBAR_STYLES as readonly string[]).includes(value);
}

/** Ghi thuộc tính lên `<html>`. Bỏ hẳn attribute khi bằng mặc định — CSS coi vắng mặt là "mặc định". */
export function applyAppearanceToDocument(sidebarStyle: SidebarStyle): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (sidebarStyle === DEFAULT_SIDEBAR_STYLE) root.removeAttribute("data-sidebar-style");
  else root.setAttribute("data-sidebar-style", sidebarStyle);
}

/**
 * Script chặn render, chạy trước hydrate để tránh nháy giao diện (FOUC) —
 * cùng cơ chế next-themes dùng cho dark/light. Đọc thẳng localStorage bằng JS
 * thuần vì chưa có React ở thời điểm này; `try/catch` vì `localStorage` ném
 * lỗi ở chế độ duyệt web riêng tư.
 */
export const APPEARANCE_INIT_SCRIPT = `(function(){try{
  var raw = localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)});
  var state = raw ? JSON.parse(raw).state : null;
  var style = state && state.sidebarStyle;
  if (style && style !== ${JSON.stringify(DEFAULT_SIDEBAR_STYLE)}) {
    document.documentElement.setAttribute('data-sidebar-style', style);
  }
}catch(e){}})();`;
