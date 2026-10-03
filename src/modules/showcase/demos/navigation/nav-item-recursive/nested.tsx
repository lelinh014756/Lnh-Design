"use client";

import { NavItemRecursive } from "@/components/navigation";
import { SidebarMenu } from "@/components/ui/sidebar";
import type { NavEntry } from "@/config/nav/nav-config";

const ENTRIES: NavEntry[] = [
  { type: "link", key: "components", labelKey: "Component", path: "/components", iconKey: "component" },
  {
    type: "group",
    key: "catalog",
    labelKey: "Catalog",
    iconKey: "package",
    children: [
      { type: "link", key: "blocks", labelKey: "Block", path: "/blocks" },
      { type: "link", key: "templates", labelKey: "Template", path: "/templates" },
      { type: "link", key: "monitoring", labelKey: "Giám sát", path: "/internal/monitoring", readiness: "none" },
    ],
  },
  { type: "link", key: "tokens", labelKey: "Token", path: "/tokens", iconKey: "swatch-book" },
];

/**
 * Nav lồng nhiều cấp sinh từ data. Nhánh chứa route đang mở tự bung, mục
 * `readiness: "none"` hiện nhưng không bấm được — sidebar nói thật về lộ trình
 * thay vì dẫn người dùng tới 404.
 */
export default function NavItemRecursiveNested() {
  return (
    <div className="max-w-xs rounded-md border bg-sidebar p-2 text-sidebar-foreground">
      <SidebarMenu>
        {ENTRIES.map((entry) => (
          <NavItemRecursive key={entry.key} entry={entry} />
        ))}
      </SidebarMenu>
    </div>
  );
}
