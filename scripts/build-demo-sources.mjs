#!/usr/bin/env node
import { glob, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Trích mã nguồn demo cho tab "Mã nguồn" của trang component.
 *
 * Một demo = một file, nên source chính là nội dung file — không parse AST,
 * không cắt theo comment marker. Mọi cơ chế cắt đều lệch sau vài lần sửa, còn
 * nội dung file thì không thể lệch với chính nó.
 *
 * Item `visibility: "internal"` BỊ LOẠI: output nằm trong bundle công khai, mà
 * mã của item nội bộ chỉ được phát qua `registry.internal.json` sau cổng token.
 * Để lọt vào đây là rò rỉ qua đường tĩnh, không ai thấy trong log truy cập.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, "..");
const DEMOS_DIR = path.join(APP_ROOT, "src/modules/showcase/demos");
const OUT_DIR = path.join(DEMOS_DIR, "generated");
const OUT_FILE = path.join(OUT_DIR, "sources.json");

async function loadVisibilityBySlug() {
  const dir = path.join(APP_ROOT, "src/config/catalog");
  // Import thẳng file data như registry-builder: chúng chỉ có `import type`,
  // bị bóc sạch lúc chạy nên Node nạp được mà không cần bundler.
  const [components, blocks] = await Promise.all([
    import(`file://${path.join(dir, "components.ts")}`),
    import(`file://${path.join(dir, "blocks.ts")}`),
  ]);

  return new Map(
    [...components.componentItems, ...blocks.blockItems].map((item) => [item.slug, item.visibility]),
  );
}

async function main() {
  const visibilityBySlug = await loadVisibilityBySlug();
  const sources = {};
  const skipped = [];

  for await (const match of glob("*/*/*.tsx", { cwd: DEMOS_DIR })) {
    const [, slug, file] = match.split(path.sep);
    const demoId = file.replace(/\.tsx$/, "");

    if (visibilityBySlug.get(slug) === "internal") {
      skipped.push(`${slug}/${demoId}`);
      continue;
    }

    sources[`${slug}/${demoId}`] = await readFile(path.join(DEMOS_DIR, match), "utf8");
  }

  const leaked = Object.keys(sources).filter(
    (key) => visibilityBySlug.get(key.split("/")[0]) === "internal",
  );
  if (leaked.length > 0) {
    console.error(`demo-source THẤT BẠI: mã item nội bộ lọt vào output — ${leaked.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  const ordered = Object.fromEntries(Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(OUT_FILE, `${JSON.stringify(ordered, null, 2)}\n`);

  console.log(`demos/generated/sources.json  ${Object.keys(ordered).length} demo`);
  if (skipped.length > 0) console.log(`  bỏ qua (nội bộ): ${skipped.join(", ")}`);
}

await main();
