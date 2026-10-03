"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type PreviewViewport = "desktop" | "tablet" | "mobile";

export const VIEWPORT_WIDTH: Record<PreviewViewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

/** Chiều cao trước khi khung con báo số đo thật — đủ để không thấy khung sập rồi giãn ra. */
const INITIAL_HEIGHT = 420;
const MIN_HEIGHT = 160;
/** Chặn trên để một demo lỗi (vòng lặp render đẩy chiều cao vô hạn) không kéo dài trang mẹ vô tận. */
const MAX_HEIGHT = 4000;

export interface PreviewFrameProps {
  /** Slug trong catalog — cũng là param của `/preview/[name]`. */
  name: string;
  /** Id demo khi component có nhiều demo. Bỏ trống → demo đơn trong `previews/`. */
  demo?: string;
  viewport?: PreviewViewport;
  /** Đổi giá trị này để ép tải lại khung. */
  reloadKey?: number;
  /** Cao bằng khung chứa thay vì theo số đo khung con — dùng khi phóng to toàn màn hình. */
  fill?: boolean;
  className?: string;
  title?: string;
}

/**
 * Khung xem trước bằng iframe.
 *
 * Dùng iframe thay vì render thẳng trong trang vì hai lý do cùng lúc: demo được
 * cách ly khỏi CSS của trang mẹ, và đổi viewport là đổi bề rộng thật (media
 * query trong demo chạy đúng).
 *
 * Chiều cao do khung con đo rồi `postMessage` lên — không đọc
 * `contentDocument.scrollHeight` từ ngoài, vì cách đó chỉ chạy khi cùng origin
 * và không nhận được thay đổi sau lần đo đầu tiên.
 *
 * Đổi viewport CHỈ đổi `width` của iframe, không đổi `src`: đổi `src` sẽ khiến
 * demo mất hết state người dùng vừa thao tác.
 */
export function PreviewFrame({
  name,
  demo,
  viewport = "desktop",
  reloadKey = 0,
  fill = false,
  className,
  title,
}: PreviewFrameProps) {
  const [height, setHeight] = useState(INITIAL_HEIGHT);

  const onMessage = useCallback(
    (event: MessageEvent) => {
      // Chỉ nhận message từ chính origin này. Bỏ kiểm tra là mở cửa cho bất kỳ
      // trang nhúng nào ép chiều cao khung.
      if (event.origin !== window.location.origin) return;

      const data = event.data as { type?: string; name?: string; value?: number } | null;
      if (!data || data.type !== "aurecook:height" || typeof data.value !== "number") return;
      if (data.name !== name) return;

      setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.ceil(data.value))));
    },
    [name],
  );

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  const params = new URLSearchParams();
  if (demo) params.set("demo", demo);
  const query = params.toString();

  return (
    <div
      className={cn(
        "flex w-full justify-center overflow-hidden bg-background",
        fill && "h-full",
        className,
      )}
    >
      <iframe
        key={`${name}-${reloadKey}`}
        src={`/preview/${name}${query ? `?${query}` : ""}`}
        title={title ?? name}
        loading="lazy"
        className="w-full border-0 bg-background transition-[width] duration-300 ease-out"
        style={{ width: VIEWPORT_WIDTH[viewport], height: fill ? "100%" : height }}
        // Demo là mã của chính repo này, nhưng vẫn khoá quyền tối thiểu: cho
        // phép script (demo cần tương tác) và same-origin (cần postMessage),
        // không cho mở popup hay điều hướng trang mẹ.
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}

export default PreviewFrame;
