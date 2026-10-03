"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Nút chép nội dung vào clipboard.
 *
 * Timer reset được giữ trong ref và dọn khi unmount: bấm liên tiếp rồi rời
 * trang giữa chừng, không có bước dọn này React sẽ báo setState trên component
 * đã tháo.
 *
 * `navigator.clipboard` không có trên HTTP không bảo mật (trừ localhost) —
 * lỗi được nuốt và nút giữ nguyên trạng thái, thay vì ném ra console một lỗi
 * người dùng không làm gì được.
 */
export function CopyButton({
  value,
  label,
  className,
  size = "md",
  idleIcon,
}: {
  value: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
  /**
   * Icon thay cho hình hai tờ giấy ở trạng thái chưa chép.
   *
   * Có ích khi thứ được chép không phải "một đoạn text": chép prompt cho AI,
   * chép link chia sẻ… Trạng thái ĐÃ chép vẫn là dấu tích — đó là phản hồi
   * người dùng đã học, đổi theo từng chỗ là bắt họ học lại.
   */
  idleIcon?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { dict } = useT();
  const t = dict.showcase;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard bị chặn (HTTP thường, quyền bị từ chối) — không có gì để báo.
    }
  }, [value]);

  const iconSize = size === "sm" ? "size-3.5" : "size-4";
  const icon = copied ? (
    <CheckIcon className={iconSize} />
  ) : (
    (idleIcon ?? <CopyIcon className={iconSize} />)
  );

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ?? (copied ? t.copied : t.copy)}
      title={label ?? (copied ? t.copied : t.copy)}
      className={cn(
        "grid shrink-0 place-items-center rounded-md text-muted-foreground",
        "transition-colors duration-150 hover:bg-accent hover:text-foreground",
        size === "sm" ? "size-7" : "size-8",
        copied && "text-primary hover:text-primary",
        className,
      )}
    >
      {icon}
    </button>
  );
}

export default CopyButton;
