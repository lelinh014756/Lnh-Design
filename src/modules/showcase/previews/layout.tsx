"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Scroller } from "@/components/ui/scroller";
import StatisticsCard from "@/components/layout/statistics-card";
import { StatisticsCardGrid } from "@/components/layout/statistics-card-grid";

import type { PreviewMap } from "./types";

const STATS = [
  {
    title: "Component",
    value: "82",
    icon: "component" as const,
    delta: { value: 12, direction: "up" as const, label: "so với quý trước" },
    sparkline: [42, 48, 51, 59, 64, 71, 82],
  },
  {
    title: "Lượt cài",
    value: "1.284",
    icon: "package" as const,
    delta: { value: 8.4, direction: "up" as const, label: "30 ngày" },
    sparkline: [820, 910, 940, 1010, 1105, 1190, 1284],
  },
  {
    title: "Repo dùng",
    value: "6",
    icon: "box" as const,
    delta: { value: 0, direction: "flat" as const, label: "không đổi" },
  },
  {
    title: "Item nội bộ",
    value: "3",
    icon: "lock" as const,
    delta: { value: 2, direction: "down" as const, label: "đã công khai bớt" },
  },
];

export const layoutPreviews: PreviewMap = {
  separator: () => (
    <div className="flex max-w-md flex-col gap-4">
      <p className="text-sm text-muted-foreground">Phần trên</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Phần dưới</p>
      <div className="flex h-8 items-center gap-3 text-sm">
        <span>Public</span>
        <Separator orientation="vertical" />
        <span>Internal</span>
        <Separator orientation="vertical" />
        <span>Nháp</span>
      </div>
    </div>
  ),

  "aspect-ratio": () => (
    <div className="max-w-sm">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border bg-muted">
        <div className="grid size-full place-items-center bg-linear-to-br from-primary/15 to-brand-secondary/15 text-sm text-muted-foreground">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  ),

  item: () => (
    <div className="max-w-lg overflow-hidden rounded-lg border">
      {["table-core", "table-chrome", "data-table"].map((name, index) => (
        <Item key={name} className={index > 0 ? "border-t" : undefined}>
          <ItemContent>
            <ItemTitle className="font-mono text-sm">@lnhdesign/{name}</ItemTitle>
            <ItemDescription>Registry · lucide-react ^1.31.0</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="sm">
              Chép
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  ),

  scroller: () => (
    <Scroller className="h-48 max-w-sm rounded-lg border p-4">
      <div className="flex flex-col gap-3 text-sm">
        {Array.from({ length: 14 }, (_, index) => (
          <p key={index} className="text-muted-foreground">
            Dòng {index + 1} — vùng cuộn có bóng mờ ở hai đầu để báo còn nội dung.
          </p>
        ))}
      </div>
    </Scroller>
  ),

  "stats-overview": () => (
    <div className="flex flex-col gap-5">
      <StatisticsCardGrid>
        {STATS.map((stat) => (
          <StatisticsCard key={stat.title} {...stat} />
        ))}
      </StatisticsCardGrid>
    </div>
  ),
};
