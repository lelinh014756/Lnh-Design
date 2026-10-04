"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AppIcon from "@/components/general/app-icon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { CatalogSidebar } from "./catalog-sidebar";

/**
 * Sidebar của `/blocks`, lọc theo loại đang chọn.
 *
 * Nguồn của "loại đang chọn" là query `?kind=` — CÙNG giá trị mà hàng tab trên
 * trang ghi vào. Nhờ vậy đổi tab là sidebar đổi theo mà không cần store dùng
 * chung giữa hai cây React tách rời (layout và page).
 *
 * Bộ chọn loại đặt luôn trong sidebar vì trang chi tiết block không có hàng tab
 * nào cả — không có nó, vào trang chi tiết là mắc kẹt trong loại vừa chọn.
 */
export function BlocksCatalogSidebar({ items }: { items: BlockCatalogItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useT();
  const t = dict.blocks;
  const showcase = dict.showcase;

  const kindParam = searchParams.get("kind");
  const kind: BlockKindFilter = kindParam && isBlockKind(kindParam) ? kindParam : "all";
  const counts = countByKind(items);
  const suffix = kind === "all" ? "" : `?kind=${kind}`;

  const groups = groupByCategory(blocksOfKind(items, kind)).map((group) => ({
    key: group.category,
    label: showcase.categories[group.category],
    icon: CATEGORY_ICONS[group.category],
    items: group.items.map((item) => ({
      href: `/blocks/${group.category}/${item.slug}${suffix}`,
      label: item.name,
      badge: item.isNew ? showcase.new : undefined,
    })),
  }));

  return (
    <CatalogSidebar
      header={
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-full items-center gap-2 rounded-md border bg-background px-2.5 text-sm transition-colors duration-150 hover:bg-accent/60">
            <span className="truncate">{t.kinds[kind]}</span>
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {counts[kind]}
            </span>
            <AppIcon icon="chevrons-up-down" className="size-3.5 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {BLOCK_KIND_FILTERS.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() =>
                  router.push(option === "all" ? "/blocks" : `/blocks?kind=${option}`)
                }
                className="gap-2"
              >
                <AppIcon icon="check"
                  className={cn("size-3.5", option === kind ? "opacity-100" : "opacity-0")}
                />
                <span className="mr-auto">{t.kinds[option]}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {counts[option]}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      }
      overview={{
        href: `/blocks${suffix}`,
        label: showcase.overview,
        icon: "layers",
        count: counts[kind],
      }}
      groups={groups}
    />
  );
}

export default BlocksCatalogSidebar;
