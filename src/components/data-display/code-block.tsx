import { CopyButton } from "@/components/general/copy-button";
import { cn } from "@/lib/utils";

/**
 * Khối mã có nút chép.
 *
 * Không tô màu cú pháp: highlighter kéo theo một parser vào bundle cho thứ mà
 * ở đây gần như luôn là một dòng lệnh shell hoặc một mẩu JSON ngắn. Khi nào có
 * trang thật sự cần đọc file dài mới tính tới.
 */
export function CodeBlock({
  code,
  language,
  className,
  showCopy = true,
}: {
  code: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-muted/40",
        className,
      )}
    >
      {language && (
        <span className="absolute top-2.5 left-4 font-mono text-[11px] tracking-wide text-muted-foreground/70">
          {language}
        </span>
      )}
      <pre
        className={cn(
          "overflow-x-auto px-4 pb-4 font-mono text-[13px] leading-6 text-foreground",
          language ? "pt-9" : "pt-4",
          showCopy && "pr-12",
        )}
      >
        <code>{code}</code>
      </pre>
      {showCopy && (
        <CopyButton
          value={code}
          size="sm"
          className="absolute top-2 right-2 bg-background/80 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
        />
      )}
    </div>
  );
}

/** Một dòng lệnh shell — biến thể hay dùng nhất, luôn kèm nút chép. */
export function CommandLine({ command, className }: { command: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-muted/40 py-2 pr-2 pl-4",
        className,
      )}
    >
      <span className="shrink-0 font-mono text-sm text-muted-foreground select-none">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap text-foreground">
        {command}
      </code>
      <CopyButton value={command} size="sm" />
    </div>
  );
}
