"use client";

import {
  EmptyListIllustration,
  EmptySearchIllustration,
  ErrorGenericIllustration,
} from "@/components/illustrations";

/** Bộ hình trạng thái: rỗng vì chưa có dữ liệu, rỗng vì lọc không ra, và lỗi. */
export default function IllustrationsGallery() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {[
        { node: <EmptyListIllustration label="Chưa có dữ liệu" />, caption: "EmptyList" },
        { node: <EmptySearchIllustration label="Không khớp bộ lọc" />, caption: "EmptySearch" },
        { node: <ErrorGenericIllustration label="Có lỗi xảy ra" />, caption: "ErrorGeneric" },
      ].map((entry) => (
        <figure key={entry.caption} className="flex flex-col items-center gap-2">
          <div className="w-full max-w-[13rem]">{entry.node}</div>
          <figcaption className="text-xs text-muted-foreground">{entry.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
