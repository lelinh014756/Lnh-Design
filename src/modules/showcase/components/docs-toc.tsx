"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Mục lục trong trang.
 *
 * Theo dõi mục đang đọc bằng `IntersectionObserver` với `rootMargin` cắt bớt
 * phần trên: không có nó, mục được coi là "đang xem" ngay khi chạm đáy màn hình
 * và con trỏ luôn chạy trước mắt người đọc một nhịp.
 */
export function DocsToc({
  label,
  sections,
}: {
  label: string;
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-20 flex flex-col gap-2 border-l pl-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "text-sm leading-6 transition-colors duration-150",
              active === section.id
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default DocsToc;
