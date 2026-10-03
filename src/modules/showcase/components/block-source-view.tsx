"use client";

import { useEffect, useState } from "react";

import { CopyButton } from "@/components/general/copy-button";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface RegistryFile {
  path: string;
  content?: string;
}

/**
 * Tab "Mã nguồn" của một block.
 *
 * Nguồn là `public/r/{slug}.json` — CHÍNH file mà CLI tải về khi cài, nên thứ
 * đọc trên trang và thứ chạy trong repo người dùng không thể lệch nhau. Tải
 * lười lúc mở tab: block nhiều file, kéo sẵn cho mọi card trên trang là trả phí
 * cho thứ đa số không mở.
 */
export function BlockSourceView({ slug }: { slug: string }) {
  const [files, setFiles] = useState<RegistryFile[] | null>(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const { dict } = useT();
  const t = dict.showcase;

  useEffect(() => {
    let alive = true;

    fetch(`/r/${slug}.json`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((item: { files?: RegistryFile[] }) => {
        if (!alive) return;
        setFiles((item.files ?? []).filter((file) => file.content));
      })
      .catch(() => alive && setFailed(true));

    return () => {
      alive = false;
    };
  }, [slug]);

  if (failed) {
    return (
      <p className="px-5 py-10 text-center text-sm text-muted-foreground">{t.sourceUnavailable}</p>
    );
  }

  if (!files) {
    return (
      <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        {t.loadingSource}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-muted-foreground">{t.sourceUnavailable}</p>
    );
  }

  const current = files[Math.min(active, files.length - 1)];

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center gap-1 overflow-x-auto border-b bg-muted/30 px-2 py-1.5">
        {files.map((file, index) => (
          <button
            key={file.path}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            className={cn(
              "shrink-0 rounded-sm px-2 py-1 font-mono text-[11px] transition-colors duration-150",
              index === active
                ? "bg-background font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {file.path.split("/").pop()}
          </button>
        ))}
        <span className="ml-auto shrink-0 pl-2">
          <CopyButton value={current.content ?? ""} label={t.copyCode} size="sm" />
        </span>
      </div>

      <pre className="max-h-[32rem] overflow-auto px-5 py-4 font-mono text-[12.5px] leading-5">
        {current.content}
      </pre>
    </div>
  );
}

export default BlockSourceView;
