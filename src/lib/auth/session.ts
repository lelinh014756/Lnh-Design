/**
 * Phiên đăng nhập cho khu vực nội bộ.
 *
 * Cookie tự ký HMAC-SHA256 thay vì JWT: chỉ cần chứng minh "người này đã đăng
 * nhập, hết hạn lúc T" cho vài trang nội bộ, không có claim nghiệp vụ nào để
 * mang theo. Verify chạy được cả trên Edge (proxy) lẫn Node (route handler).
 *
 * Payload cố ý không mang gì ngoài email + hạn: cookie đi qua tay người dùng,
 * mọi thứ nhét vào đó là thứ họ đọc được.
 */

export const SESSION_COOKIE = "aurecook_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export interface SessionPayload {
  email: string;
  /** Unix seconds. */
  exp: number;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Thiếu secret là lỗi cấu hình, không phải trạng thái chạy được — ném ngay tại
 * chỗ thay vì lặng lẽ ký bằng chuỗi rỗng và tạo ra phiên ai cũng giả được.
 */
function sessionSecret(): string {
  const secret = process.env.AURECOOK_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AURECOOK_SESSION_SECRET phải có và dài ít nhất 32 ký tự. Sinh bằng: openssl rand -base64 48",
    );
  }
  return secret;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(email: string): Promise<string> {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };

  const body = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(),
    new TextEncoder().encode(body),
  );

  return `${body}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      decodeBase64Url(signature) as BufferSource,
      new TextEncoder().encode(body),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
} as const;
