"use client";

import { CopyButton } from "@/components/general/copy-button";
import { useT } from "@/lib/i18n/context";
import type { TokenEntry } from "@/lib/tokens/parse-globals";

/** Giá trị nào vẽ được thành ô màu — chuỗi `oklch(...)`, `#hex`, `rgb(...)`, `var(--x)`. */
function isColorLike(value: string): boolean {
  return /^(oklch|rgb|hsl|#|var\()/i.test(value.trim());
}

function Swatch({ value }: { value: string }) {
  if (!isColorLike(value)) return null;

  return (
    <span
      aria-hidden
      className="inline-block size-4 shrink-0 rounded-sm border border-border/70 align-middle"
      style={{ background: value }}
    />
  );
}

/**
 * Bảng tra token cho một nhóm.
 *
 * Ô màu tô bằng chính chuỗi giá trị đọc từ CSS — không quy đổi sang hex trong
 * JS. Trình duyệt là thứ hiểu `oklch()` đúng nhất, và một hàm quy đổi tự viết
 * chỉ tạo ra khả năng bảng hiện một màu còn giao diện hiện màu khác.
 */
export function TokenTable({ title, tokens }: { title: string; tokens: TokenEntry[] }) {
  const { dict } = useT();
  const t = dict.tokens;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-baseline gap-2 text-lg font-semibold tracking-tight text-foreground">
        {title}
        <span className="text-sm font-normal tabular-nums text-muted-foreground">
          {tokens.length}
        </span>
      </h2>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th className="px-4 py-2.5 font-medium text-muted-foreground">{t.variable}</th>
              <th className="px-4 py-2.5 font-medium text-muted-foreground">{t.light}</th>
              <th className="px-4 py-2.5 font-medium text-muted-foreground">{t.dark}</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.name} className="border-b last:border-b-0">
                <td className="px-4 py-2 font-mono text-[13px] text-foreground">{token.name}</td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                    <Swatch value={token.light} />
                    <span className="truncate">{token.light}</span>
                  </span>
                </td>
                <td className="px-4 py-2">
                  {token.dark ? (
                    <span className="flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                      <Swatch value={token.dark} />
                      <span className="truncate">{token.dark}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/60">—</span>
                  )}
                </td>
                <td className="px-1 py-1">
                  <CopyButton value={`var(${token.name})`} label={t.copyVar} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TokenTable;
