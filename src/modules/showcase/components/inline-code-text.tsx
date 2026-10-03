import { Fragment } from "react";

/**
 * Mô tả demo và ghi chú prop viết `tên` bằng backtick như markdown — đây chỉ
 * dựng đúng một cú pháp đó thành `<code>`, không kéo cả trình parse markdown.
 * Số backtick lẻ (quên đóng) thì giữ nguyên văn thay vì biến nửa câu thành code.
 */
export function InlineCodeText({ text }: { text: string }) {
  const parts = text.split("`");
  if (parts.length % 2 === 0) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded-sm bg-muted px-1 py-px font-mono text-[0.92em] text-foreground/85"
          >
            {part}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
