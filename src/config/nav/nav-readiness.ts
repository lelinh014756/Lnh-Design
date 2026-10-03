import type { NavGroupChild, NavLink, NavSection } from "./nav-config";

/** Trạng thái triển khai màn hình — `done` = không hiện chấm trên sidebar. */
export type NavReadiness = "none" | "ui_only" | "partial" | "integrated" | "done";

export const NAV_READINESS_LEVELS: readonly Exclude<NavReadiness, "done">[] = [
  "none",
  "ui_only",
  "partial",
  "integrated",
] as const;

export function resolveNavReadiness(link: NavLink): NavReadiness {
  return link.readiness ?? "done";
}

function collectFromGroupChildren(children: NavGroupChild[], out: Set<NavReadiness>) {
  for (const child of children) {
    if (child.type === "link") {
      const r = resolveNavReadiness(child);
      if (r !== "done") out.add(r);
    } else if (child.type === "subgroup") {
      collectFromGroupChildren(child.children, out);
    }
  }
}

/** Các mức readiness (không gồm `done`) có trong sections — dùng cho legend. */
export function collectNavReadinessLevels(sections: NavSection[]): Exclude<NavReadiness, "done">[] {
  const set = new Set<NavReadiness>();
  for (const section of sections) {
    for (const entry of section.items) {
      if (entry.type === "link") {
        const r = resolveNavReadiness(entry);
        if (r !== "done") set.add(r);
      } else {
        collectFromGroupChildren(entry.children, set);
      }
    }
  }
  return NAV_READINESS_LEVELS.filter((level) => set.has(level));
}

export function navSectionsShowReadinessLegend(sections: NavSection[]): boolean {
  return collectNavReadinessLevels(sections).length > 0;
}
