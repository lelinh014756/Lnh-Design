/**
 * `locale` nhận trực tiếp giá trị `locale` từ `useT()` (`"vi"`/`"en"`) — Intl
 * chấp nhận mã 2 ký tự này thẳng, không cần bảng ánh xạ sang `"vi-VN"`/
 * `"en-US"`. Mặc định `"en-US"` để chỗ gọi chưa truyền locale (ngoài React,
 * hoặc chưa migrate) không đổi hành vi.
 */
export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
  locale: string = "en-US",
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat(locale, {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return "";
  }
}
