"use client";

import { useEffect, useState } from "react";

/**
 * `true` khi trang đã cuộn quá `threshold`.
 *
 * Đọc `scrollY` trong rAF thay vì ngay trong handler để không ép trình duyệt
 * tính lại layout ở mỗi sự kiện cuộn. Giá trị khởi tạo là `false` để khớp với
 * bản render phía server — trình duyệt tự sửa ngay ở lần đo đầu tiên trong
 * effect, kể cả khi người dùng tải lại trang ở giữa chừng.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
