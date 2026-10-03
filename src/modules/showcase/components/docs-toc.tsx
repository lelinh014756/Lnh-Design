"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface DocsTocSection {
  id: string;
  label: string;
}

interface ThumbRect {
  top: number;
  height: number;
}

/** Dải đọc tính theo tỉ lệ chiều cao màn hình. */
const READING_BAND = { top: 0.2, bottom: 0.7 };
/** Header 56px luôn chiếm đỉnh màn hình, cộng chút đệm. */
const HEADER_INSET = 64;

/**
 * Mục lục trong trang, bám theo vùng cuộn của `ShowcaseShell`.
 *
 * Một mục "đang đọc" khi thân nó cắt qua dải 20–70% màn hình, HOẶC nằm trọn
 * trên màn hình. Vế đầu loại mục chỉ còn ló một mẩu sát header hay sát đáy;
 * vế sau cứu mục cuối ngắn — cuộn hết trang nó vẫn nằm dưới dải, không bao giờ
 * cắt qua được. Nhiều mục sáng cùng lúc là đúng: ví dụ ngắn thường nằm hai ba
 * cái trên một màn. Thân mục là `<section>` gần nhất bọc phần tử mang `id`
 * (DemoCard, PropsTable, trang docs). Không mục nào khớp — khe giữa hai mục —
 * thì giữ lựa chọn cũ thay vì để thanh chỉ báo biến mất.
 *
 * Tính theo `getBoundingClientRect` mỗi frame cuộn thay vì `IntersectionObserver`:
 * observer chỉ báo lúc qua ngưỡng, không trả lời được "đã nằm trọn chưa" khi
 * mục cao hơn dải.
 *
 * `<aside>` phải là con trực tiếp của hàng flex/grid và `self-start`: phần tử
 * sticky chỉ trượt được trong cha của nó, cha cao bằng chính nó là đứng im.
 */
export function DocsToc({
  label,
  sections,
  className,
}: {
  label: string;
  sections: DocsTocSection[];
  className?: string;
}) {
  // Khoá bằng chuỗi id: cha render lại là ra mảng mới, nội dung thì không đổi.
  const idsKey = sections.map((section) => section.id).join("\n");
  const [activeIds, setActiveIds] = useState<string[]>(() =>
    sections[0] ? [sections[0].id] : [],
  );
  const [thumb, setThumb] = useState<ThumbRect | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const regions = idsKey.split("\n").flatMap((id) => {
      const anchor = document.getElementById(id);
      return anchor ? [{ id, element: anchor.closest("section") ?? anchor }] : [];
    });
    if (regions.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const bandTop = viewportHeight * READING_BAND.top;
      const bandBottom = viewportHeight * READING_BAND.bottom;

      const next = regions
        .filter(({ element }) => {
          const rect = element.getBoundingClientRect();
          const crossesBand = rect.bottom > bandTop && rect.top < bandBottom;
          const fullyOnScreen = rect.top >= HEADER_INSET && rect.bottom <= viewportHeight;
          return crossesBand || fullyOnScreen;
        })
        .map(({ id }) => id);

      if (next.length === 0) return;
      setActiveIds((current) =>
        current.length === next.length && current.every((id, index) => id === next[index])
          ? current
          : next,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // `capture`: sự kiện scroll không nổi bọt, nhưng vẫn đi qua `document` ở pha
    // bắt — bắt được cả cửa sổ (từ `xl`) lẫn div cuộn của shell (dưới `xl`).
    document.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    };
  }, [idsKey]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const links = activeIds
        .map((id) => list.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(id)}"]`))
        .filter((link): link is HTMLElement => link !== null);
      const first = links[0];
      const last = links[links.length - 1];
      setThumb(
        first && last
          ? { top: first.offsetTop, height: last.offsetTop + last.offsetHeight - first.offsetTop }
          : null,
      );
    };

    measure();
    // Nhãn xuống dòng khác đi khi font tải xong hoặc cột đổi bề rộng.
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(list);
    return () => resizeObserver.disconnect();
  }, [activeIds]);

  if (sections.length === 0) return null;

  return (
    <aside
      className={cn(
        "sticky top-(--showcase-sticky-top,5rem) hidden max-h-[calc(100dvh-var(--showcase-sticky-top,5rem)-1.5rem)] self-start overflow-y-auto lg:block",
        className,
      )}
    >
      <p className="mb-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      {/* `ml-1 mb-1`: chấm cuối thumb lòi 3px ra ngoài đường ray — không chừa chỗ
          thì `aside` (overflow-y-auto) cắt mất nửa chấm và hiện thanh cuộn thừa. */}
      <nav aria-label={label} className="relative mb-1 ml-1">
        <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-border" />
        {thumb && (
          <span
            aria-hidden
            className="absolute left-0 w-px bg-primary transition-[top,height] duration-300 ease-out motion-reduce:transition-none"
            style={{ top: thumb.top, height: thumb.height }}
          >
            <span className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary" />
          </span>
        )}
        <ul ref={listRef} className="flex flex-col">
          {sections.map((section) => {
            const isActive = activeIds.includes(section.id);
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-toc-id={section.id}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "block py-1.5 pl-3.5 text-sm leading-5 transition-colors duration-150",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default DocsToc;
