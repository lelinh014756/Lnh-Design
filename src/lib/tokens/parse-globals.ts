import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Đọc token trực tiếp từ `globals.css`.
 *
 * Không chép sang một file TS song song: bảng tra phải nói đúng thứ đang chạy,
 * mà bản chép tay thì chỉ đúng tới lần sửa CSS kế tiếp. Parse bằng regex vì thứ
 * cần lấy là các dòng `--name: value;` bên trong đúng hai khối `:root` và
 * `.dark` — không có cấu trúc CSS nào phải hiểu để làm việc đó.
 */

export interface TokenEntry {
  name: string;
  light: string;
  dark?: string;
}

export type TokenGroupKey = "color" | "sidebar" | "chart" | "radius" | "typography" | "motion";

export interface TokenGroup {
  key: TokenGroupKey;
  tokens: TokenEntry[];
}

const DECLARATION = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gim;

function extractBlock(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`\n${selector} {`);
  if (start === -1) return {};

  const open = css.indexOf("{", start);
  let depth = 0;
  let end = open;

  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  const body = css.slice(open + 1, end);
  const found: Record<string, string> = {};

  for (const match of body.matchAll(DECLARATION)) {
    found[match[1]] = match[2].trim();
  }

  return found;
}

function groupOf(name: string): TokenGroupKey {
  if (name.startsWith("--sidebar")) return "sidebar";
  if (name.startsWith("--chart")) return "chart";
  if (name.startsWith("--radius")) return "radius";
  if (name.startsWith("--font") || name.startsWith("--text") || name.startsWith("--tracking")) {
    return "typography";
  }
  if (name.startsWith("--animate") || name.includes("duration") || name.includes("ease")) {
    return "motion";
  }
  return "color";
}

const GROUP_ORDER: TokenGroupKey[] = [
  "color",
  "sidebar",
  "chart",
  "radius",
  "typography",
  "motion",
];

export async function readDesignTokens(): Promise<TokenGroup[]> {
  const css = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf8");

  const light = extractBlock(css, ":root");
  const dark = extractBlock(css, ".dark");

  const buckets = new Map<TokenGroupKey, TokenEntry[]>(GROUP_ORDER.map((key) => [key, []]));

  for (const [name, value] of Object.entries(light)) {
    buckets.get(groupOf(name))?.push({ name, light: value, dark: dark[name] });
  }

  return GROUP_ORDER.map((key) => ({
    key,
    tokens: (buckets.get(key) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.tokens.length > 0);
}
