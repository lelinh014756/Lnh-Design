"use client";

import { useState, type ComponentType } from "react";
import { CodeIcon, RefreshCwIcon } from "lucide-react";

import { CopyButton } from "@/components/general/copy-button";
import { AppCard } from "@/components/layout/app-card";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

import { DemoBoundary } from "./demo-boundary";
import { PreviewFrame } from "./preview-frame";

export interface DemoCardProps {
  /** Neo trong trang; `DocsToc` bám vào đúng id này. */
  id: string;
  slug: string;
  title: string;
  description?: string;
  /** Có thể vắng khi `pnpm demos:build` chưa chạy lại sau lúc thêm demo. */
  source?: string;
  component: ComponentType;
  mode?: "inline" | "frame";
}

/**
 * Một ví dụ trên trang component: khung chạy thật, mô tả, và mã nguồn gập/mở.
 *
 * Dựng trên `AppCard` thay vì tự chế khung: đây là card duy nhất người dùng
 * nhìn thấy nhiều nhất trên site, để nó lệch với card mà họ sắp cài về là gửi
 * đi một thông điệp sai. `scroll={false}` vì demo tự quyết chiều cao — vùng
 * cuộn lồng trong trang cuộn là hai thanh cuộn tranh nhau một cử chỉ.
 *
 * Nút tải lại bump `key` để remount: rẻ hơn reload iframe và đúng nghĩa "đưa
 * demo về trạng thái đầu".
 */
export function DemoCard({
  id,
  slug,
  title,
  description,
  source,
  component: Demo,
  mode = "inline",
}: DemoCardProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const { dict } = useT();
  const t = dict.showcase;

  return (
    <AppCard
      className="scroll-mt-20"
      scroll={false}
      bodyClassName="p-0"
      title={
        <h3 id={id} className="scroll-mt-20 font-semibold tracking-tight">
          {title}
        </h3>
      }
      action={
        <>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            aria-label={t.reloadDemo}
            title={t.reloadDemo}
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <RefreshCwIcon className="size-3.5" />
          </button>
          {source && (
            <>
              <button
                type="button"
                onClick={() => setCodeOpen((open) => !open)}
                aria-expanded={codeOpen}
                aria-controls={`${id}-code`}
                title={codeOpen ? t.hideCode : t.showCode}
                className={cn(
                  "grid size-7 place-items-center rounded-md transition-colors duration-150 hover:bg-accent hover:text-foreground",
                  codeOpen ? "bg-accent text-foreground" : "text-muted-foreground",
                )}
              >
                <CodeIcon className="size-3.5" />
              </button>
              <CopyButton value={source} label={t.copyCode} size="sm" />
            </>
          )}
        </>
      }
    >
      <div className="border-b bg-background px-5 py-6 md:px-6">
        <DemoBoundary key={reloadKey} fallbackLabel={t.demoFailed}>
          {mode === "frame" ? (
            <PreviewFrame name={slug} demo={id} reloadKey={reloadKey} title={title} />
          ) : (
            <Demo />
          )}
        </DemoBoundary>
      </div>

      {description && (
        <p className="px-5 py-3.5 text-sm leading-6 text-muted-foreground md:px-6">{description}</p>
      )}

      {source && codeOpen && (
        <pre
          id={`${id}-code`}
          className="max-h-[26rem] overflow-auto border-t bg-muted/40 px-5 py-4 font-mono text-[12.5px] leading-5 md:px-6"
        >
          {source}
        </pre>
      )}
    </AppCard>
  );
}

export default DemoCard;
