/**
 * Điểm đọc biến môi trường duy nhất của app.
 *
 * Mọi giá trị ở đây là secret phía server: chỉ import từ route handler,
 * `proxy.ts` và `src/lib/auth/*` — không import từ component client hay từ
 * file thuộc một registry item.
 *
 * Script Node chạy ngoài Next (`scripts/registry-builder/config.mjs`,
 * `scripts/hash-password.mjs`) không resolve được alias `@/`, nên tự đọc biến
 * của mình.
 */

/** Khoá HMAC ký cookie phiên; `sessionSecret()` kiểm tra độ dài lúc dùng. */
export const APP_SESSION_SECRET = (
  process.env.LNHDESIGN_SESSION_SECRET ?? ""
).trim()

/** Tài khoản nội bộ dạng `email:hash,email:hash`. */
export const APP_INTERNAL_USERS = (process.env.LNHDESIGN_USERS ?? "").trim()

/** Token Bearer của registry nội bộ `/r/internal/*`. */
export const APP_REGISTRY_TOKEN = (process.env.LNHDESIGN_TOKEN ?? "").trim()