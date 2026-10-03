"use client";

import { PackageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { DependencyEntry } from "@/lib/registry/dependencies";
import { useT } from "@/lib/i18n/context";

/**
 * Nút + modal liệt kê phụ thuộc của một item.
 *
 * Nút nằm luôn trong đây chứ không để nơi gọi tự dựng: component và block từng
 * mỗi bên một kiểu trigger, và giữ một bản duy nhất là cách rẻ nhất để chúng
 * không lệch lại.
 *
 * Dữ liệu đến từ `registry.json` đã build — KHÔNG từ catalog. Catalog cố ý
 * không mang `registryDependencies`/`dependencies`: chép chúng sang đó là tạo
 * ra nguồn thứ hai, và mỗi lần item đổi phụ thuộc là một dịp để hai nguồn lệch
 * nhau.
 */
export function DependenciesDialog({
  itemName,
  dependencies,
}: {
  itemName: string;
  dependencies: DependencyEntry[];
}) {
  const { dict } = useT();
  const t = dict.showcase;

  if (dependencies.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors duration-150 hover:bg-accent"
        >
          <PackageIcon className="size-3.5" />
          {t.dependencies}
          <span className="tabular-nums text-muted-foreground">{dependencies.length}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.dependencies}</DialogTitle>
          <DialogDescription>
            {t.dependenciesOf.replace("{name}", itemName)}
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-[24rem] divide-y overflow-y-auto rounded-lg border">
          {dependencies.map((dependency) => (
            <li
              key={`${dependency.source}-${dependency.name}`}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5"
            >
              <code className="min-w-0 truncate font-mono text-[13px] text-foreground">
                {dependency.name}
              </code>
              <Badge
                variant="outline"
                className={
                  dependency.source === "registry"
                    ? "shrink-0 border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "shrink-0 border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                }
              >
                {dependency.source === "registry" ? t.registryBadge : t.npmBadge}
              </Badge>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export default DependenciesDialog;
