import { isWellFormedHash, verifyPassword } from "./password";

/**
 * Bảng người dùng nội bộ.
 *
 * Nguồn là biến môi trường `AURECOOK_USERS`, định dạng
 * `email:hash,email:hash` — hash sinh bằng `node scripts/hash-password.mjs`.
 * Không có đăng ký tự phục vụ và không có database: số người dùng là vài thành
 * viên trong đội, thêm một hạ tầng lưu trữ cho ngần đó tài khoản là chi phí
 * không đổi lại được gì.
 */

interface InternalUser {
  email: string;
  passwordHash: string;
}

function parseUsers(): InternalUser[] {
  const raw = process.env.AURECOOK_USERS;
  if (!raw) return [];

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.indexOf(":");
      if (separator === -1) return null;
      return {
        email: entry.slice(0, separator).trim().toLowerCase(),
        passwordHash: entry.slice(separator + 1).trim(),
      };
    })
    .filter((user): user is InternalUser => user !== null && user.passwordHash.length > 0);
}

/**
 * Cảnh báo khi có cấu hình user nhưng hash không đúng dạng.
 *
 * Không có bước này, một biến môi trường hỏng trông y hệt một mật khẩu sai:
 * cả hai đều trả 401. Người vận hành sẽ đi tìm lỗi ở mật khẩu trong khi vấn đề
 * nằm ở file `.env`.
 */
function warnMalformed(users: InternalUser[]): void {
  for (const user of users) {
    if (isWellFormedHash(user.passwordHash)) continue;
    console.error(
      `[auth] AURECOOK_USERS: hash của "${user.email}" sai định dạng ` +
        `(cần pbkdf2.<iterations>.<salt>.<hash>). ` +
        "Sinh lại bằng: node scripts/hash-password.mjs <email> <password>",
    );
  }
}

/**
 * Trả email đã chuẩn hoá khi đúng, `null` khi sai.
 *
 * Email không tồn tại vẫn chạy qua một lần `verifyPassword` với hash giả: nếu
 * trả về sớm, thời gian phản hồi tự tố cáo email nào có thật trong hệ thống.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  const users = parseUsers();
  warnMalformed(users);
  const user = users.find((candidate) => candidate.email === normalized);

  const hash =
    user?.passwordHash ??
    "pbkdf2.210000.AAAAAAAAAAAAAAAAAAAAAA==.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

  const ok = await verifyPassword(password, hash);
  return ok && user ? user.email : null;
}

export function hasConfiguredUsers(): boolean {
  return parseUsers().length > 0;
}
