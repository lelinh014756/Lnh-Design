import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { ComponentCatalogItem } from "@/config/catalog";
import type { Locale } from "@/lib/i18n/types";

/**
 * Ô component trên trang tổng quan.
 *
 * Cố ý KHÔNG render demo sống: trang này liệt kê toàn bộ catalog, mỗi ô một cây
 * React nữa là vài chục demo chạy cùng lúc chỉ để người dùng bấm vào một cái.
 * Demo nằm ở trang chi tiết, nơi nó là nội dung chính.
 */
export function ComponentIndexCard({
  item,
  locale,
  newLabel,
  internalLabel,
}: {
  item: ComponentCatalogItem;
  locale: Locale;
  newLabel: string;
  internalLabel: string;
}) {
  return (
    <Link
      href={`/components/${item.slug}`}
      className="group flex flex-col gap-1.5 rounded-md border bg-card px-4 py-3.5 transition-colors duration-150 hover:border-primary/40 hover:bg-accent/40"
    >
      <span className="flex items-center gap-2">
        <span className="truncate font-medium tracking-tight text-foreground">{item.name}</span>
        {item.isNew && (
          <Badge variant="secondary" className="rounded-4xl px-2 py-0 text-[11px]">
            {newLabel}
          </Badge>
        )}
        {item.visibility === "internal" && (
          <Badge variant="outline" className="rounded-4xl px-2 py-0 text-[11px]">
            {internalLabel}
          </Badge>
        )}
      </span>
      <span className="line-clamp-2 text-[13px] leading-5 text-muted-foreground">
        {item.description[locale]}
      </span>
    </Link>
  );
}

export default ComponentIndexCard;
