import { readFile } from "node:fs/promises";

import ts from "typescript";

/**
 * Rút danh sách import của một file bằng scanner của TypeScript.
 *
 * KHÔNG dùng regex. Bản regex trước đây khớp cả chữ `import` nằm trong chuỗi —
 * `onError?.("import", error)` bị đọc thành một specifier dài mấy trăm ký tự
 * gồm nguyên phần thân hàm phía sau, rồi lọt vào `dependencies` và làm CLI
 * phía người cài gọi npm với một "tên gói" chứa xuống dòng.
 *
 * `preProcessFile` là scanner nhẹ TypeScript dùng cho chính việc này: nó hiểu
 * cú pháp nên không nhầm chuỗi, chú thích hay tên định danh có chứa `import`,
 * và rẻ hơn nhiều so với parse ra AST đầy đủ.
 */
export async function readImports(filePath) {
  const source = await readFile(filePath, "utf8");
  const info = ts.preProcessFile(source, true, true);

  return [...new Set(info.importedFiles.map((ref) => ref.fileName))];
}

/** `@scope/pkg/sub` → `@scope/pkg`; `pkg/sub` → `pkg`. */
export function packageNameOf(specifier) {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

export function isBareSpecifier(specifier) {
  return !specifier.startsWith(".") && !specifier.startsWith("@/") && !specifier.startsWith("node:");
}
