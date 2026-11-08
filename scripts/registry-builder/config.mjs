import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** Gốc app — nơi có `src/`, `package.json`, `registry.manifest.json`. Script nằm ở `scripts/registry-builder/`. */
export const APP_ROOT = path.resolve(here, "../..");

export const REGISTRY_NAME = "lnhdesign";
export const HOMEPAGE = process.env.LNHDESIGN_HOMEPAGE ?? "https://lnhdesign.vercel.app";

/**
 * Import mà file registry KHÔNG được phép dùng.
 *
 * `@lnhdesign/*` là alias workspace — nó resolve được ở repo này và không
 * resolve được ở bất kỳ repo khách nào. Đây là loại lỗi chỉ lộ ra SAU khi đã
 * publish, nên chặn cứng ở bước build.
 */
export const FORBIDDEN_IMPORTS = [
  {
    prefix: "@lnhdesign/",
    reason: "alias workspace không resolve được ở repo khách",
  },
  {
    prefix: "@/lib/i18n",
    reason:
      "item registry phải tự mang chuỗi hiển thị (labels prop → localization → " +
      "mặc định gắn sẵn); đọc thẳng từ điển của app là không cài được vào repo trống",
  },
];

/** Import chỉ cảnh báo, chưa chặn. Rỗng — mọi thứ từng nằm đây đã trả xong. */
export const WARN_IMPORT_PREFIXES = [];

/**
 * Ánh xạ tiền tố đường dẫn nguồn → `type` + `target` của registry item.
 *
 * Bốn placeholder `@ui/ @components/ @hooks/ @lib/` để CLI tự đặt file theo
 * alias của từng repo khách — repo này dùng `@/components/ui`, repo khác có thể
 * dùng tên khác, và item không được phép biết trước.
 *
 * KHÔNG được đẻ thêm thư mục ngoài bốn alias đó cho code mà item khác import.
 * Alias `@/types/` từng được dùng cho `types/table.ts`: CLI không biết nó, và
 * mọi import `@/types/table` bị nắn sang alias `ui` — file đáp đúng chỗ nhưng
 * không ai import tới được. Type của cụm nay nằm trong `lib/table/types.ts`.
 *
 * `config/` và `layouts/` vẫn phải neo theo gốc dự án bằng `~/` vì không có
 * placeholder tương ứng. Chấp nhận được vì không file nào ngoài item import
 * chéo vào chúng.
 */
export const TARGET_RULES = [
  { prefix: "src/components/ui/", type: "registry:ui", target: (rel) => `@ui/${path.basename(rel)}` },
  { prefix: "src/components/", type: "registry:component", target: (rel) => `@components/${rel.slice("src/components/".length)}` },
  { prefix: "src/hooks/", type: "registry:hook", target: (rel) => `@hooks/${rel.slice("src/hooks/".length)}` },
  { prefix: "src/lib/", type: "registry:lib", target: (rel) => `@lib/${rel.slice("src/lib/".length)}` },
  { prefix: "src/config/", type: "registry:file", target: (rel) => `~/${rel}` },
  { prefix: "src/layouts/", type: "registry:file", target: (rel) => `~/${rel}` },
  { prefix: "src/store/", type: "registry:file", target: (rel) => `~/${rel}` },
];

export function classifyFile(relFromApp) {
  const rule = TARGET_RULES.find((candidate) => relFromApp.startsWith(candidate.prefix));
  if (!rule) return null;
  return { type: rule.type, target: rule.target(relFromApp) };
}
