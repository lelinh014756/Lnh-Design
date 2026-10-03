"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import AppIcon from "@/components/general/app-icon";
import { Badge } from "@/components/ui/badge";
import {
  BLOCK_KIND_FILTERS,
  CATEGORY_ICONS,
  blocksOfKind,
  countByKind,
  groupByCategory,
  isBlockKind,
  type BlockCatalogItem,
  type BlockKindFilter,
} from "@/config/catalog";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Trang duyệt block: hàng tab theo loại, ô tìm, lưới thẻ NHÓM.
 *
 * Loại đang chọn nằm ở query `?kind=` chứ không phải state cục bộ — sidebar đọc
 * cùng giá trị đó để lọc theo, và một URL gửi cho đồng nghiệp mở ra đúng thứ
 * mình đang xem. Từ khoá tìm thì ngược lại: giữ trong state, vì đẩy mỗi ký tự
 * lên URL là mỗi ký tự một lần ghi lịch sử điều hướng.
 *
 * Thẻ là NHÓM chứ không phải từng block: nhóm mới là thứ người ta đang tìm
 * ("mình cần màn đăng nhập"), còn chọn biến thể nào là việc của trang nhóm.
 */
export function BlockCatalogBrowser({ items }: { items: BlockCatalogItem[] }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dict, locale } = useT();
  const t = dict.blocks;
  const showcase = dict.showcase;

  const kindParam = searchParams.get("kind");
  const kind: BlockKindFilter = kindParam && isBlockKind(kindParam) ? kindParam : "all";
  const counts = useMemo(() => countByKind(items), [items]);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const scoped = blocksOfKind(items, kind).filter((item) => {
      if (!needle) return true;
      return `${item.name} ${item.slug} ${item.description[locale]}`.toLowerCase().includes(needle);
    });
    return groupByCategory(scoped);
  }, [items, kind, query, locale]);

  const selectKind = (next: BlockKindFilter) => {
    const params = new URLSearchParams(searchParams);
    if (next === "all") params.delete("kind");
    else params.set("kind", next);

    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-card p-1">
        {BLOCK_KIND_FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => selectKind(option)}
            aria-pressed={kind === option}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors duration-150",
              kind === option
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.kinds[option]}
            <span className="text-xs tabular-nums opacity-60">{counts[option]}</span>
          </button>
        ))}

        <label className="relative ml-auto flex h-8 min-w-0 flex-1 items-center md:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="h-full w-full rounded-md border border-input bg-background pr-3 pl-8 text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground focus-visible:border-ring"
          />
        </label>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-lg border border-dashed px-5 py-12 text-center text-sm text-muted-foreground">
          {t.empty}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const href = kind === "all"
              ? `/blocks/${group.category}`
              : `/blocks/${group.category}?kind=${kind}`;

            return (
              <Link
                key={group.category}
                href={href}
                className="group flex flex-col overflow-hidden rounded-md border bg-card transition-colors duration-150 hover:border-primary/40"
              >
                <div className="flex min-h-32 flex-1 flex-col justify-center gap-1.5 bg-primary/4 px-4 py-5">
                  {group.items.slice(0, 4).map((item) => (
                    <span
                      key={item.slug}
                      className="truncate rounded-sm border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {item.name}
                    </span>
                  ))}
                  {group.items.length > 4 && (
                    <span className="px-1 text-xs text-muted-foreground">
                      +{group.items.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t px-4 py-2.5">
                  <AppIcon
                    icon={CATEGORY_ICONS[group.category]}
                    size={15}
                    className="shrink-0 text-muted-foreground"
                  />
                  <span className="mr-auto truncate font-medium tracking-tight text-foreground">
                    {showcase.categories[group.category]}
                  </span>
                  {group.items.some((item) => item.isNew) && (
                    <Badge variant="secondary" className="rounded-4xl px-2 py-0 text-[11px]">
                      {showcase.new}
                    </Badge>
                  )}
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {group.items.length} {t.countSuffix}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BlockCatalogBrowser;
