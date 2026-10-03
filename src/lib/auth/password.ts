/**
 * Băm mật khẩu bằng PBKDF2-SHA256 qua Web Crypto.
 *
 * Chọn PBKDF2 thay vì bcrypt/argon2 vì hai lý do cùng lúc: nó chạy được trên
 * Edge runtime (nơi `proxy.ts` sống) và không kéo thêm native dependency vào
 * một site showcase. Số vòng lặp theo khuyến nghị OWASP cho PBKDF2-HMAC-SHA256.
 *
 * Không có bảng user trong repo — hash nằm ở biến môi trường, sinh bằng
 * `node scripts/hash-password.mjs`.
 */

const ITERATIONS = 210_000;
const KEY_LENGTH = 32;
const PREFIX = "pbkdf2";

/**
 * Dấu phân cách giữa các đoạn của hash.
 *
 * KHÔNG dùng `$` như quy ước quen thuộc của PHC string: hash này sống trong
 * biến môi trường, mà trình nạp `.env` của Next chạy qua dotenv-expand —
 * `$210000` bị coi là tham chiếu biến rồi thay bằng chuỗi rỗng. Kết quả là
 * hash cụt lặng lẽ và mọi lần đăng nhập đều sai mà không có dấu hiệu gì.
 *
 * `.` an toàn tuyệt đối vì bảng chữ base64 chỉ gồm `A-Za-z0-9+/=`.
 */
const SEPARATOR = ".";

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    KEY_LENGTH * 8,
  );

  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, ITERATIONS);
  return [PREFIX, ITERATIONS, toBase64(salt), toBase64(hash)].join(SEPARATOR);
}

/** So sánh theo thời gian hằng số — độ dài khác nhau trả false ngay, phần còn lại XOR hết mảng. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function isWellFormedHash(stored: string): boolean {
  const parts = stored.split(SEPARATOR);
  return parts.length === 4 && parts[0] === PREFIX && Number.isFinite(Number(parts[1]));
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(SEPARATOR);
  if (parts.length !== 4 || parts[0] !== PREFIX) return false;

  const iterations = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  try {
    const salt = fromBase64(parts[2]);
    const expected = fromBase64(parts[3]);
    const actual = await derive(password, salt, iterations);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
