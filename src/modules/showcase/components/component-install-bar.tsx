"use client";

import { CopyButton } from "@/components/general/copy-button";
import { installCommand, registryItemName, type CatalogItem } from "@/config/catalog";
import type { DependencyEntry } from "@/lib/registry/dependencies";
import { useT } from "@/lib/i18n/context";

import { DependenciesDialog } from "./dependencies-dialog";

/**
 * Hàng lệnh cài của một item.
 *
 * Tên registry hiện nguyên văn cạnh lệnh: người dùng thường cần tên để khai vào
 * script cài hàng loạt, chứ không phải lúc nào cũng chạy đúng lệnh này.
 */
export function ComponentInstallBar({
  item,
  dependencies,
}: {
  item: CatalogItem;
  dependencies: DependencyEntry[];
}) {
  const { dict } = useT();
  const t = dict.showcase;

  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-md border bg-muted/30 px-3 py-2.5">
      <code className="rounded-md bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
        {registryItemName(item)}
      </code>
      <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-foreground">
        {installCommand(item)}
      </code>
      <CopyButton value={installCommand(item)} label={t.copyCommand} size="sm" />
      <DependenciesDialog itemName={item.name} dependencies={dependencies} />
    </div>
  );
}

export default ComponentInstallBar;
