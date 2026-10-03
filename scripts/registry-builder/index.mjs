#!/usr/bin/env node
import { createHash } from "node:crypto";
import { glob, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  APP_ROOT,
  classifyFile,
  FORBIDDEN_IMPORTS,
  HOMEPAGE,
  REGISTRY_NAME,
  WARN_IMPORT_PREFIXES,
} from "./config.mjs";
import { readManifest } from "./manifest.mjs";
import { isBareSpecifier, packageNameOf, readImports } from "./resolve-imports.mjs";
import { resolveAliasImport, verifyClosure } from "./verify-closure.mjs";

/**
 * Dựng `registry.json` (public) và `registry.internal.json` (nội bộ).
 *
 * Phụ thuộc KHÔNG khai tay: `registryDependencies` suy từ import
 * `@/components/ui/*`, `dependencies` suy từ import gói ngoài rồi tra version
 * trong `package.json` của app. Khai tay thì mỗi lần thêm một import là một cơ
 * hội quên cập nhật, và lỗi chỉ lộ ra ở máy người cài.
 */

/**
 * Nạp catalog thẳng từ ba file data.
 *
 * Không đi qua `index.ts` vì file đó value-import các file con bằng đường dẫn
 * không đuôi — hợp lệ với bundler, nhưng ESM của Node đòi đuôi đầy đủ. Ba file
 * data chỉ có `import type` (bị bóc sạch lúc chạy), nên import trực tiếp là
 * chạy được mà không phải sửa gì phía app.
 */
async function loadCatalog() {
  const dir = path.join(APP_ROOT, "src/config/catalog");
  const load = async (file) => import(`file://${path.join(dir, file)}`);

  const [components, blocks, templates] = await Promise.all([
    load("components.ts"),
    load("blocks.ts"),
    load("templates.ts"),
  ]);

  return {
    componentCatalog: [
      ...components.componentItems,
      ...blocks.blockItems,
      ...templates.templateItems,
    ],
  };
}

async function loadAppPackageJson() {
  const raw = await readFile(path.join(APP_ROOT, "package.json"), "utf8");
  const parsed = JSON.parse(raw);
  return { ...parsed.dependencies, ...parsed.devDependencies };
}

/**
 * Giải glob, hỗ trợ loại trừ bằng tiền tố `!`.
 *
 * Cần vì một thư mục có thể chứa file thuộc hai item khác nhau:
 * `components/table/*.tsx` gom cả `table-select-column.tsx` — file đó thuộc
 * `table-core`, không thuộc `table-chrome`.
 */
async function expandFiles(patterns) {
  const files = new Set();
  const excluded = new Set();

  for (const pattern of patterns) {
    const negated = pattern.startsWith("!");
    const raw = negated ? pattern.slice(1) : pattern;
    const sink = negated ? excluded : files;

    if (!raw.includes("*")) {
      sink.add(raw);
      continue;
    }
    for await (const match of glob(raw, { cwd: APP_ROOT })) {
      sink.add(match.split(path.sep).join("/"));
    }
  }

  return [...files].filter((f) => !excluded.has(f)).sort();
}

function defaultPatternsFor(item) {
  if (item.kind !== "component") return null;
  if (item.layer === "primitive") return [`src/components/ui/${item.slug}.tsx`];
  return null;
}

/**
 * Tên registry đầy đủ của một phụ thuộc.
 *
 * PHẢI có namespace `@aurecook/`. Tên trần (`action-bar`) được CLI hiểu là item
 * của registry shadcn CHÍNH THỨC — nó sẽ đi gọi ui.shadcn.com và fail với những
 * primitive ta tự vendor, hoặc tệ hơn: kéo về đúng bản upstream cho `button`,
 * `badge`… làm mất hết phần đã chỉnh theo style và token của hệ.
 */
function qualifyDependency(name, visibilityBySlug) {
  const namespace = visibilityBySlug.get(name) === "internal" ? "@aurecook-x" : "@aurecook";
  return `${namespace}/${name}`;
}

async function buildItem(item, manifestEntry, versions, problems, visibilityBySlug, ownerOfFile) {
  const patterns = manifestEntry?.files ?? defaultPatternsFor(item);
  const declaredDeps = manifestEntry?.registryDependencies ?? [];

  // Item "gói": không mang file riêng, chỉ gom vài item khác lại thành một lệnh
  // cài. Hợp lệ — và là cách đúng để một block không phát lại file mà item
  // component đã sở hữu.
  if (!patterns && declaredDeps.length === 0) return null;

  const relPaths = patterns ? await expandFiles(patterns) : [];
  if (patterns && relPaths.length === 0) {
    problems.push(`${item.slug}: không khớp file nào với ${patterns.join(", ")}`);
    return null;
  }

  const registryDeps = new Set(manifestEntry?.registryDependencies ?? []);
  const npmDeps = new Set();
  const hash = createHash("sha256");
  const files = [];

  for (const rel of relPaths) {
    const absolute = path.join(APP_ROOT, rel);
    const classified = classifyFile(rel);

    if (!classified) {
      problems.push(`${item.slug}: ${rel} không nằm trong thư mục nào builder biết cách đặt target`);
      continue;
    }

    const content = await readFile(absolute, "utf8");
    hash.update(rel).update(content);
    // Nội dung nhúng thẳng vào JSON: máy chủ không phải đọc file lúc có
    // request, nên không có đường dẫn động nào để Next phải trace cả repo.
    files.push({ path: rel, type: classified.type, target: classified.target, content });

    for (const specifier of await readImports(absolute)) {
      const forbidden = FORBIDDEN_IMPORTS.find((rule) => specifier.startsWith(rule.prefix));
      if (forbidden) {
        problems.push(`${item.slug}: ${rel} import "${specifier}" — ${forbidden.reason}`);
        continue;
      }

      if (WARN_IMPORT_PREFIXES.some((prefix) => specifier.startsWith(prefix))) {
        console.warn(`  ! ${item.slug}: ${rel} còn phụ thuộc "${specifier}"`);
      }

      // Import `@/…` trỏ vào file do item KHÁC mang theo thì đó là một
      // registry dependency. Suy từ bảng `ownerOfFile` thay vì chỉ nhận diện
      // `@/components/ui/*` như trước: primitive không phải nguồn phụ thuộc duy
      // nhất — `badge-status` cần `app-icon`, `table-chrome` cần `app-sheet`.
      if (specifier.startsWith("@/")) {
        const source = await resolveAliasImport(specifier);
        if (source && !relPaths.includes(source)) {
          const owner = ownerOfFile.get(source);
          if (owner && owner !== item.slug) registryDeps.add(owner);
        }
        continue;
      }

      if (!isBareSpecifier(specifier)) continue;

      const pkg = packageNameOf(specifier);
      if (pkg === "react" || pkg === "react-dom" || pkg === "next") continue;

      const version = versions[pkg];
      npmDeps.add(version ? `${pkg}@${version}` : pkg);
    }
  }

  const entry = {
    name: item.slug,
    type: manifestEntry?.type ?? (item.kind === "component" && item.layer === "primitive" ? "registry:ui" : "registry:component"),
    title: item.name,
    description: item.description.en,
    categories: item.categories,
    files,
    meta: {
      version: manifestEntry?.version ?? "0.1.0",
      sourceHash: hash.digest("hex").slice(0, 16),
      visibility: item.visibility,
    },
  };

  if (registryDeps.size > 0) {
    // Item công khai kéo theo item nội bộ nghĩa là bất kỳ ai cũng cài được
    // phần đáng lẽ chỉ trong đội — rò rỉ qua cây phụ thuộc, không qua danh sách.
    if (item.visibility !== "internal") {
      for (const dep of registryDeps) {
        if (visibilityBySlug.get(dep) === "internal") {
          problems.push(
            `${item.slug} (công khai) phụ thuộc "${dep}" (nội bộ) — cài item công khai sẽ kéo theo item nội bộ`,
          );
        }
      }
    }

    entry.registryDependencies = [...registryDeps]
      .map((dep) => qualifyDependency(dep, visibilityBySlug))
      .sort();
  }
  if (npmDeps.size > 0) entry.dependencies = [...npmDeps].sort();
  if (manifestEntry?.cssVars) entry.cssVars = manifestEntry.cssVars;
  if (manifestEntry?.css) entry.css = manifestEntry.css;

  return entry;
}

async function main() {
  const { componentCatalog } = await loadCatalog();
  const manifest = await readManifest();
  const versions = await loadAppPackageJson();
  const problems = [];

  const publicItems = [];
  const internalItems = [];
  const visibilityBySlug = new Map(componentCatalog.map((i) => [i.slug, i.visibility]));

  // Lượt 1: chỉ giải glob để biết file nào thuộc item nào. Suy phụ thuộc chéo
  // item cần bảng này có sẵn trước khi dựng bất kỳ item nào.
  const ownerOfFile = new Map();
  for (const item of componentCatalog) {
    const patterns = manifest[item.slug]?.files ?? defaultPatternsFor(item);
    if (!patterns) continue;
    for (const rel of await expandFiles(patterns)) {
      if (!ownerOfFile.has(rel)) ownerOfFile.set(rel, item.slug);
    }
  }

  // Lượt 2: dựng thật.
  for (const item of componentCatalog) {
    const entry = await buildItem(
      item, manifest[item.slug], versions, problems, visibilityBySlug, ownerOfFile,
    );
    if (!entry) continue;
    (item.visibility === "internal" ? internalItems : publicItems).push(entry);
  }

  await verifyClosure([...publicItems, ...internalItems], problems);

  if (problems.length > 0) {
    console.error("\nregistry-build THẤT BẠI:");
    for (const problem of problems) console.error(`  ✗ ${problem}`);
    process.exitCode = 1;
    return;
  }

  const base = { $schema: "https://ui.shadcn.com/schema/registry.json", homepage: HOMEPAGE };

  // Bỏ `content` khỏi index: index phục vụ giao diện (tên, mô tả, phụ thuộc),
  // còn nội dung file chỉ CLI cần và nó lấy ở từng file item riêng.
  const stripContent = (items) =>
    items.map((item) => ({
      ...item,
      files: item.files.map((file) => ({ path: file.path, type: file.type, target: file.target })),
    }));

  /**
   * Item công khai phát hành THÀNH FILE TĨNH trong `public/r/`.
   *
   * CDN trả thẳng, không đụng tới máy chủ, và quan trọng hơn: không còn đoạn mã
   * nào đọc file theo đường dẫn dựng lúc chạy — thứ khiến Next phải đóng gói cả
   * repo vào bundle server.
   *
   * Item nội bộ KHÔNG đi lối này: mọi thứ trong `public/` là công khai theo
   * định nghĩa. Chúng nằm ở `registry.internal.json` ngoài `public/`, sau cổng
   * kiểm token.
   */
  const publicDir = path.join(APP_ROOT, "public/r");
  await rm(publicDir, { recursive: true, force: true });
  await mkdir(publicDir, { recursive: true });

  for (const item of publicItems) {
    await writeFile(path.join(publicDir, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
  }

  await writeFile(
    path.join(publicDir, "registry.json"),
    `${JSON.stringify({ ...base, name: REGISTRY_NAME, items: stripContent(publicItems) }, null, 2)}\n`,
  );
  await writeFile(
    path.join(APP_ROOT, "registry.json"),
    `${JSON.stringify({ ...base, name: REGISTRY_NAME, items: stripContent(publicItems) }, null, 2)}\n`,
  );
  await writeFile(
    path.join(APP_ROOT, "registry.internal.json"),
    `${JSON.stringify({ ...base, name: `${REGISTRY_NAME}-x`, items: internalItems }, null, 2)}\n`,
  );

  console.log(`public/r/*.json        ${publicItems.length} item (tĩnh, CDN trả thẳng)`);
  console.log(`registry.internal.json ${internalItems.length} item (sau cổng token)`);
}

await main();
