import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Đọc registry JSON đã build.
 *
 * Chỉ có ĐÚNG HAI đường dẫn cố định được đọc — `registry.json` và
 * `registry.internal.json`. Đọc file theo đường dẫn dựng lúc chạy khiến Next
 * phải đóng gói toàn bộ repo vào bundle server; nội dung từng file vì thế được
 * nhúng sẵn vào JSON ở bước build (`scripts/registry-builder`).
 *
 * Item công khai không đi qua đây chút nào: chúng là file tĩnh trong
 * `public/r/`, CDN trả thẳng.
 */

export interface RegistryFile {
  path: string;
  type: string;
  target: string;
  content?: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  categories?: string[];
  files: RegistryFile[];
  registryDependencies?: string[];
  dependencies?: string[];
  cssVars?: Record<string, Record<string, string>>;
  css?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export type RegistryChannel = "public" | "internal";

// Cache theo tiến trình: file chỉ đổi khi deploy lại, nên đọc một lần là đủ.
const cache = new Map<RegistryChannel, Promise<Registry>>();

function loadRegistry(channel: RegistryChannel): Promise<Registry> {
  const cached = cache.get(channel);
  if (cached) return cached;

  // Hai nhánh viết tường minh thay vì ghép chuỗi: đường dẫn tĩnh thì Next chỉ
  // đóng gói đúng hai file này, không phải cả cây nguồn.
  const pending = (
    channel === "internal"
      ? readFile(path.join(process.cwd(), "registry.internal.json"), "utf8")
      : readFile(path.join(process.cwd(), "registry.json"), "utf8")
  ).then((raw) => JSON.parse(raw) as Registry);

  cache.set(channel, pending);
  return pending;
}

export async function getRegistry(channel: RegistryChannel): Promise<Registry> {
  return loadRegistry(channel);
}

/** Trả item kèm nội dung file — `registry.internal.json` đã nhúng sẵn từ bước build. */
export async function getRegistryItem(
  channel: RegistryChannel,
  name: string,
): Promise<RegistryItem | null> {
  const registry = await loadRegistry(channel);
  return registry.items.find((candidate) => candidate.name === name) ?? null;
}

/** Bản rút gọn cho UI: không kèm nội dung file, chỉ phần khai phụ thuộc. */
export async function getRegistryItemMeta(name: string): Promise<RegistryItem | null> {
  for (const channel of ["public", "internal"] as const) {
    const registry = await loadRegistry(channel);
    const item = registry.items.find((candidate) => candidate.name === name);
    if (item) return item;
  }
  return null;
}
