"use client";

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
 * Modal liệt kê phụ thuộc của một item.
 *
 * Dữ liệu đến từ `registry.json` đã build — KHÔNG từ catalog. Catalog cố ý
 * không mang `registryDependencies`/`dependencies`: chép chúng sang đó là tạo
 * ra nguồn thứ hai, và mỗi lần item đổi phụ thuộc là một dịp để hai nguồn lệch
 * nhau.
 */
export function DependenciesDialog({
  itemName,
  dependencies,
  children,
}: {
  itemName: string;
  dependencies: DependencyEntry[];
  children: React.ReactNode;
}) {
  const { dict } = useT();
  const t = dict.showcase;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.dependencies}</DialogTitle>
          <DialogDescription>
            {t.dependenciesOf.replace("{name}", itemName)}
          </DialogDescription>
        </DialogHeader>

        {dependencies.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t.noDependencies}</p>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DependenciesDialog;
