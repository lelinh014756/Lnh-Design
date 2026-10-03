import { cookies } from "next/headers";

import { COOKIE_NAME, DEFAULT_LOCALE, isLocale, type Locale } from "./types";

/**
 * Đọc locale người dùng đã chọn từ cookie `NEXT_LOCALE` ở phía server.
 * Trả về `DEFAULT_LOCALE` khi cookie thiếu hoặc chứa giá trị không hợp lệ.
 */
export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;

  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
