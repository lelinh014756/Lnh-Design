import { notFound } from "next/navigation";

import { findCatalogItem } from "@/config/catalog";
import { PreviewStage } from "@/modules/showcase/components/preview-stage";

/**
 * Đích của iframe xem trước.
 *
 * Chỉ kiểm slug có trong catalog. Việc "có demo hay không" do `PreviewStage`
 * phía client trả lời: bảng demo nằm trong các module `"use client"`, mà Server
 * Component nhìn chúng dưới dạng client reference — tra cứu ở đây sẽ luôn ra
 * rỗng và mọi khung xem đều 404.
 */
export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ theme?: string; demo?: string }>;
}) {
  const { name } = await params;
  const { theme, demo } = await searchParams;

  if (!findCatalogItem(name)) notFound();

  return <PreviewStage name={name} demo={demo} theme={theme === "dark" ? "dark" : "light"} />;
}
