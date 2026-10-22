import { access } from "node:fs/promises";
import path from "node:path";

import { APP_ROOT, classifyFile } from "./config.mjs";
import { readImports } from "./resolve-imports.mjs";

/**
 * File mà mọi repo shadcn đã có sẵn sau `shadcn init`, nên item không cần mang theo.
 *
 * `lib/utils` là nơi `cn` sống — CLI tạo nó lúc init và ánh xạ qua alias
 * `utils`. Khai nó trong item là ghi đè file người dùng có thể đã sửa.
 */
const PROVIDED_BY_INIT = ["src/lib/utils.ts"];

const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

/** `@/components/x/y` → đường dẫn nguồn thật, hoặc `null` nếu không có file nào khớp. */
export async function resolveAliasImport(specifier) {
  const base = path.join("src", specifier.slice("@/".length));

  for (const ext of EXTENSIONS) {
    const candidate = `${base}${ext}`;
    try {
      await access(path.join(APP_ROOT, candidate));
      return candidate;
    } catch {
      // thử đuôi kế tiếp
    }
  }
  return null;
}

/**
 * Kiểm mỗi item có ĐỦ file để tự đứng được.
 *
 * Một item chỉ hợp lệ khi mọi import `@/…` của nó trỏ vào file do chính nó
 * mang theo, hoặc do một `registryDependencies` (đệ quy) mang theo. Thiếu một
 * file thì lỗi chỉ lộ ra trên máy người cài, sau khi đã publish — đúng loại
 * lỗi đắt nhất.
 *
 * Đây là thứ đã để lọt `data-table` re-export `./hooks/use-data-table` (file
 * thuộc item `data-table-url`) và import `@/lib/format` không khai ở đâu cả.
 */
export async function verifyClosure(entries, problems) {
  const bySlug = new Map(entries.map((entry) => [entry.name, entry]));
  const filesOf = new Map(
    entries.map((entry) => [entry.name, new Set(entry.files.map((f) => f.path))]),
  );

  const closure = (slug, seen = new Set()) => {
    if (seen.has(slug)) return new Set();
    seen.add(slug);

    const own = new Set(filesOf.get(slug) ?? []);
    for (const dep of bySlug.get(slug)?.registryDependencies ?? []) {
      // Bỏ namespace: `@lnhdesign/badge` → `badge`.
      const depSlug = dep.includes("/") ? dep.slice(dep.indexOf("/") + 1) : dep;
      for (const file of closure(depSlug, seen)) own.add(file);
    }
    return own;
  };

  // Một file bị hai item cùng nhận là của mình thì bản cài về có thể thừa
  // hoặc thiếu tuỳ item nào được cài trước — luôn là lỗi khai báo.
  const claimedBy = new Map();
  for (const entry of entries) {
    for (const file of entry.files) {
      const owners = claimedBy.get(file.path) ?? [];
      owners.push(entry.name);
      claimedBy.set(file.path, owners);
    }
  }
  for (const [file, owners] of claimedBy) {
    if (owners.length > 1) {
      problems.push(`${file} bị nhiều item cùng khai: ${owners.join(", ")}`);
    }
  }

  for (const entry of entries) {
    const available = closure(entry.name);

    for (const file of entry.files) {
      const ownGroup = classifyFile(file.path)?.type;

      for (const specifier of await readImports(path.join(APP_ROOT, file.path))) {
        // Import tương đối vượt sang nhóm target khác sẽ đứt sau khi cài: CLI
        // đặt mỗi nhóm vào một alias riêng của repo khách, nên `../ui/button`
        // từ `components/general/` trỏ vào hư không.
        if (specifier.startsWith("../")) {
          const resolvedRel = path.join(path.dirname(file.path), specifier);
          const target = await resolveAliasImport(`@/${resolvedRel.slice("src/".length)}`);
          if (target && classifyFile(target)?.type !== ownGroup) {
            problems.push(
              `${entry.name}: ${file.path} import tương đối "${specifier}" vượt sang nhóm khác — dùng alias @/ thay vì ../`,
            );
          }
          continue;
        }

        if (!specifier.startsWith("@/")) continue;

        const resolved = await resolveAliasImport(specifier);
        if (!resolved) {
          problems.push(`${entry.name}: ${file.path} import "${specifier}" — không có file nguồn nào khớp`);
          continue;
        }
        if (PROVIDED_BY_INIT.includes(resolved)) continue;
        if (available.has(resolved)) continue;

        problems.push(
          `${entry.name}: ${file.path} import "${specifier}" → ${resolved}, ` +
            "nhưng file đó không nằm trong item lẫn registryDependencies của nó",
        );
      }
    }
  }
}
