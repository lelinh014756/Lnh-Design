"use client";

import AppIcon, { type IconName } from "@/components/general/app-icon";

const ICONS: IconName[] = [
  "rocket",
  "package",
  "shield-check",
  "swatch-book",
  "terminal",
  "sparkles",
  "layout-grid",
  "component",
];

/** Tra icon theo tên qua map tĩnh — bundle chỉ mang icon thật sự được khai. */
export default function AppIconGallery() {
  return (
    <div className="flex flex-wrap items-start gap-5">
      {ICONS.map((name) => (
        <span key={name} className="flex w-20 flex-col items-center gap-1.5">
          <AppIcon icon={name} size={22} className="text-foreground" />
          <code className="truncate text-[11px] text-muted-foreground">{name}</code>
        </span>
      ))}
    </div>
  );
}
