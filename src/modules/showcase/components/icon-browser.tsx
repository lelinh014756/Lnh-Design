"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";
import { toast } from "sonner";

import { Slider } from "@/components/ui/slider";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/** Trần số icon vẽ cùng lúc. Hơn ngần này thì lưới đứng hình khi gõ, mà không ai cuộn hết. */
const RENDER_LIMIT = 240;

/**
 * Trình duyệt icon lucide.
 *
 * Dùng `DynamicIcon` + danh sách TÊN thay vì import cả bộ component: bộ đầy đủ
 * là hơn hai nghìn icon, kéo hết vào bundle của một trang chỉ để hiện lưới là
 * cái giá không đáng.
 *
 * `useDeferredValue` giữ ô nhập luôn phản hồi: lưới được vẽ lại ở mức ưu tiên
 * thấp hơn nên gõ nhanh không thấy khựng.
 */
export function IconBrowser() {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState([24]);
  const [stroke, setStroke] = useState([1.75]);
  const deferredQuery = useDeferredValue(query);
  const { dict } = useT();
  const t = dict.icons;

  const matches = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    const source = needle
      ? iconNames.filter((name) => name.includes(needle))
      : (iconNames as readonly IconName[]);
    return { total: source.length, visible: source.slice(0, RENDER_LIMIT) };
  }, [deferredQuery]);

  const copy = async (name: string, mode: "name" | "jsx") => {
    const payload =
      mode === "name" ? name : `<DynamicIcon name="${name}" size={${size[0]}} />`;
    try {
      await navigator.clipboard.writeText(payload);
      toast.success(
        (mode === "name" ? t.copiedName : t.copiedJsx).replace("{name}", name),
      );
    } catch {
      // Clipboard bị chặn — không có gì hữu ích để nói với người dùng.
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-5">
        <label className="relative flex h-9 min-w-0 flex-1 items-center md:max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="h-full w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground focus-visible:border-ring"
          />
        </label>

        <label className="flex w-40 shrink-0 items-center gap-3 text-xs text-muted-foreground">
          {t.size}
          <Slider value={size} onValueChange={setSize} min={14} max={40} step={2} />
          <span className="w-6 text-right tabular-nums">{size[0]}</span>
        </label>

        <label className="flex w-44 shrink-0 items-center gap-3 text-xs text-muted-foreground">
          {t.strokeWidth}
          <Slider value={stroke} onValueChange={setStroke} min={1} max={3} step={0.25} />
          <span className="w-7 text-right tabular-nums">{stroke[0]}</span>
        </label>

        <span className="text-xs tabular-nums text-muted-foreground">
          {t.resultCount.replace("{count}", String(matches.total))}
        </span>
      </div>

      {matches.visible.length === 0 ? (
        <p className="rounded-lg border border-dashed px-5 py-12 text-center text-sm text-muted-foreground">
          {t.empty}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
          {matches.visible.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => copy(name, "name")}
              onContextMenu={(event) => {
                event.preventDefault();
                void copy(name, "jsx");
              }}
              title={`${name} — ${t.copyName} / ${t.copyJsx}`}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-card p-2",
                "transition-colors duration-150 hover:border-primary/40 hover:bg-accent/40",
              )}
            >
              <DynamicIcon name={name} size={size[0]} strokeWidth={stroke[0]} />
              <span className="w-full truncate text-center text-[10px] leading-4 text-muted-foreground">
                {name}
              </span>
            </button>
          ))}
        </div>
      )}

      {matches.total > matches.visible.length && (
        <p className="text-center text-xs text-muted-foreground">
          {matches.visible.length} / {matches.total}
        </p>
      )}
    </div>
  );
}

export default IconBrowser;
