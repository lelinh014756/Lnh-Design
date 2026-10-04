"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/general/app-icon";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { componentCatalog, showcaseComponentItems, type CatalogItem } from "@/config/catalog";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

function hrefFor(item: CatalogItem): string {
  switch (item.kind) {
    case "component":
      return `/components/${item.slug}`;
    case "block":
      return `/blocks/${item.categories[0]}/${item.slug}`;
    case "template":
      return `/templates/${item.slug}`;
  }
}

/**
 * Tìm kiếm toàn site (Cmd/Ctrl + K).
 *
 * Nguồn dữ liệu là catalog, không phải danh sách route: mọi thứ tìm được đều là
 * item thật trong registry, nên không bao giờ dẫn tới trang trống.
 */
export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { dict, locale } = useT();
  const t = dict.showcase;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((previous) => !previous);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const groups = useMemo(
    () => ({
      // Chỉ component cấp app: primitive vẫn có trang riêng nhưng không nằm
      // trên sidebar, nên để chúng nổi lên trong tìm kiếm là hai nguồn sự thật
      // khác nhau về "hệ này có gì".
      component: showcaseComponentItems as CatalogItem[],
      block: componentCatalog.filter((item) => item.kind === "block"),
      template: componentCatalog.filter((item) => item.kind === "template"),
    }),
    [],
  );

  const go = (item: CatalogItem) => {
    setOpen(false);
    router.push(hrefFor(item));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.openSearch}
        className={cn(
          "group flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2.5",
          "text-sm text-muted-foreground transition-colors duration-150 hover:border-ring/60 hover:text-foreground",
          "md:w-56 lg:w-64",
        )}
      >
        <AppIcon icon="search" className="size-4 shrink-0" />
        <span className="hidden truncate md:inline">{t.searchPlaceholder}</span>
        <Kbd className="ml-auto hidden md:inline-flex">⌘K</Kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl" showCloseButton={false}>
          <DialogTitle className="sr-only">{t.searchPlaceholder}</DialogTitle>
          <Command>
            <CommandInput placeholder={t.searchPlaceholder} />
            <CommandList className="max-h-[22rem]">
              <CommandEmpty>{t.searchEmpty}</CommandEmpty>
              {(["component", "block", "template"] as const).map((kind) => (
                <CommandGroup key={kind} heading={(dict[`${kind}s`] as { title: string }).title}>
                  {groups[kind].map((item) => (
                    <CommandItem
                      key={item.slug}
                      value={`${item.name} ${item.slug} ${item.description[locale]}`}
                      onSelect={() => go(item)}
                      className="flex-col items-start gap-0.5"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {item.description[locale]}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommandSearch;
