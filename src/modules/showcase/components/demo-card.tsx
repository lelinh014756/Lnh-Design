"use client";

import { useState, type ComponentType } from "react";
import { CodeIcon, RefreshCwIcon } from "lucide-react";

import { CopyButton } from "@/components/general/copy-button";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

import { DemoBoundary } from "./demo-boundary";
import { InlineCodeText } from "./inline-code-text";
import { PreviewFrame } from "./preview-frame";

export interface DemoCardProps {
  /** Neo trong trang; `DocsToc` bám vào đúng id này. */
  id: string;
  slug: string;
  title: string;
  description?: string;
  snippet?: string;
  /** Có thể vắng khi `pnpm demos:build` chưa chạy lại sau lúc thêm demo. */
  source?: string;
  component: ComponentType;
  mode?: "inline" | "frame";
  layout?: "row" | "stack";
}

const toolButton =
  "grid size-7 place-items-center rounded-md transition-colors duration-150 hover:bg-accent hover:text-foreground";

/**
 * Một ví dụ trên trang component: cột trái là tiêu đề, mô tả, nút công cụ;
 * cột phải là demo chạy thật kèm dải lời gọi rút gọn ngay dưới. Các ví dụ ngăn
 * nhau bằng một đường kẻ thay vì mỗi cái một card — khung card ăn gần 3/4 chiều
 * cao khi demo chỉ là một hàng nút. Snippet nằm bên phải vì cột trái chỉ 14rem:
 * ba dòng code ở đó gãy thành bảy.
 *
 * Chia cột theo bề rộng KHUNG (`@3xl`, cha phải là `@container`), không theo
 * viewport: có sidebar và mục lục thì viewport `lg` chỉ còn ~500px cho nội
 * dung, chia đôi nữa là demo không còn chỗ thở.
 *
 * Nút tải lại bump `key` để remount: rẻ hơn reload iframe và đúng nghĩa "đưa
 * demo về trạng thái đầu".
 */
export function DemoCard({
  id,
  slug,
  title,
  description,
  snippet,
  source,
  component: Demo,
  mode = "inline",
  layout,
}: DemoCardProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const { dict } = useT();
  const t = dict.showcase;
  const isRow = (layout ?? (mode === "frame" ? "stack" : "row")) === "row";

  return (
    <section
      aria-labelledby={id}
      className={cn(
        "grid items-start gap-3 border-b py-5 last:border-b-0",
        isRow && "@3xl:grid-cols-[14rem_minmax(0,1fr)] @3xl:gap-x-7",
      )}
    >
      <div className="flex min-w-0 flex-col">
        <h3 id={id} className="scroll-mt-20 text-sm leading-5 font-semibold tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            <InlineCodeText text={description} />
          </p>
        )}
        <div className="mt-2 -ml-1.5 flex items-center gap-0.5 text-muted-foreground">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            aria-label={t.reloadDemo}
            title={t.reloadDemo}
            className={toolButton}
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
                aria-label={codeOpen ? t.hideCode : t.showCode}
                title={codeOpen ? t.hideCode : t.showCode}
                className={cn(toolButton, codeOpen && "bg-accent text-foreground")}
              >
                <CodeIcon className="size-3.5" />
              </button>
              <CopyButton value={source} label={t.copyCode} size="sm" />
            </>
          )}
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-md border">
        <div className="bg-background px-4 py-3.5">
          <DemoBoundary key={reloadKey} fallbackLabel={t.demoFailed}>
            {mode === "frame" ? (
              <PreviewFrame name={slug} demo={id} reloadKey={reloadKey} title={title} />
            ) : (
              <Demo />
            )}
          </DemoBoundary>
        </div>
        {snippet && (
          <pre className="border-t bg-muted/40 px-4 py-2.5 font-mono text-xs leading-[1.125rem] break-words whitespace-pre-wrap text-foreground/80">
            {snippet}
          </pre>
        )}
      </div>

      {source && codeOpen && (
        <pre
          id={`${id}-code`}
          className="col-span-full max-h-[26rem] overflow-auto rounded-md border bg-muted/40 px-4 py-3 font-mono text-[12.5px] leading-5"
        >
          {source}
        </pre>
      )}
    </section>
  );
}

export default DemoCard;
