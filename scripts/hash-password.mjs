#!/usr/bin/env node
/**
 * Sinh hash mật khẩu cho `AURECOOK_USERS`.
 *
 *   node scripts/hash-password.mjs 'email@congty.vn' 'mật khẩu'
 *
 * In ra đúng một dòng `email:hash` để dán vào biến môi trường. Mật khẩu không
 * bao giờ được ghi ra file — truyền qua tham số rồi xoá khỏi lịch sử shell.
 */
const ITERATIONS = 210_000;

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Dùng: node scripts/hash-password.mjs <email> <password>");
  process.exit(1);
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  "PBKDF2",
  false,
  ["deriveBits"],
);
const bits = await crypto.subtle.deriveBits(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  key,
  256,
);

const b64 = (bytes) => Buffer.from(bytes).toString("base64");

// Dấu phân cách là `.`, KHÔNG phải `$`: giá trị này đi vào file `.env`, mà
// trình nạp env của Next expand `$xxx` thành chuỗi rỗng và cắt cụt hash.
console.log(`${email.trim().toLowerCase()}:pbkdf2.${ITERATIONS}.${b64(salt)}.${b64(new Uint8Array(bits))}`);
