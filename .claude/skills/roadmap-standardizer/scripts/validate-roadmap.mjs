#!/usr/bin/env node
/**
 * Kiểm tra một file roadmap theo đặc tả `docs/public-roadmap-format.md`.
 *
 * Dùng chính parser mà trang `/roadmap` chạy (`src/modules/roadmap/lib/roadmap-parser.ts`)
 * nên "validate qua" nghĩa là UI đọc được — không có bản parser thứ hai để lệch.
 * Cần Node >= 22.18 (chạy trực tiếp file .ts); .nvmrc của repo là 24.
 *
 *   node validate-roadmap.mjs [file.md] [--strict] [--json]
 *
 * Không truyền file thì kiểm tra file đang phục vụ trang công khai.
 * Thoát 0 = đạt, 1 = có lỗi (hoặc có cảnh báo khi --strict), 2 = không chạy được.
 */
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "../../../..")
const PARSER_PATH = path.join(repoRoot, "src/modules/roadmap/lib/roadmap-parser.ts")
const DEFAULT_FILE = path.join(repoRoot, "src/modules/roadmap/content/public-roadmap.md")

async function loadParser() {
  try {
    return await import(pathToFileURL(PARSER_PATH).href)
  } catch (error) {
    if (error?.code === "ERR_UNKNOWN_FILE_EXTENSION") {
      throw new Error(
        `Node ${process.version} chưa chạy được file .ts. Dùng Node >= 22.18 (xem .nvmrc) hoặc thêm cờ --experimental-strip-types.`
      )
    }
    throw error
  }
}

function summarize(roadmap) {
  const statuses = { phases: {}, items: {} }
  const bump = (bucket, status) => {
    const key = status ?? "unspecified"
    bucket[key] = (bucket[key] ?? 0) + 1
  }
  let items = 0
  let groups = 0
  let tasks = 0
  let done = 0
  const count = (list) => {
    tasks += list.length
    done += list.filter((task) => task.done).length
  }
  for (const phase of roadmap.phases) {
    bump(statuses.phases, phase.status)
    count(phase.tasks)
    for (const item of phase.items) {
      items += 1
      bump(statuses.items, item.status)
      count(item.tasks)
      for (const group of item.groups) {
        groups += 1
        count(group.tasks)
      }
    }
  }
  return { phases: roadmap.phases.length, items, groups, tasks, done, statuses }
}

export async function validateRoadmapText(markdown) {
  const { parseRoadmap } = await loadParser()
  const { roadmap, issues } = parseRoadmap(markdown)
  return {
    title: roadmap.title,
    updated: roadmap.updated ?? null,
    summary: summarize(roadmap),
    issues,
    errors: issues.filter((issue) => issue.level === "error").length,
    warnings: issues.filter((issue) => issue.level === "warning").length,
  }
}

function formatCounts(counts) {
  const entries = Object.entries(counts)
  return entries.length ? entries.map(([key, value]) => `${key} ${value}`).join(", ") : "—"
}

function printReport(file, result, strict) {
  const { summary } = result
  console.log(`File     : ${path.relative(process.cwd(), file) || file}`)
  console.log(`Roadmap  : ${result.title || "(thiếu H1)"}${result.updated ? ` · updated ${result.updated}` : ""}`)
  console.log(
    `Cấu trúc : ${summary.phases} phase · ${summary.items} item · ${summary.groups} group · ${summary.tasks} task (${summary.done} đã tick)`
  )
  console.log(`Phase    : ${formatCounts(summary.statuses.phases)}`)
  console.log(`Item     : ${formatCounts(summary.statuses.items)}`)
  for (const issue of result.issues) {
    const where = issue.line > 0 ? `L${issue.line}` : "doc"
    console.log(`${issue.level === "error" ? "ERROR" : "WARN "} ${where}: ${issue.message}`)
  }
  const failed = result.errors > 0 || (strict && result.warnings > 0)
  console.log(`Kết quả  : ${failed ? "FAIL" : "OK"} (${result.errors} lỗi, ${result.warnings} cảnh báo${strict ? ", --strict" : ""})`)
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node validate-roadmap.mjs [file.md] [--strict] [--json]")
    return 0
  }
  const strict = args.includes("--strict")
  const asJson = args.includes("--json")
  const fileArg = args.find((arg) => !arg.startsWith("--"))
  const file = fileArg ? path.resolve(fileArg) : DEFAULT_FILE

  let markdown
  try {
    markdown = await readFile(file, "utf8")
  } catch (error) {
    console.error(`Không đọc được ${file}: ${error.message}`)
    return 2
  }

  const result = await validateRoadmapText(markdown)
  const failed = result.errors > 0 || (strict && result.warnings > 0)
  if (asJson) console.log(JSON.stringify({ file, ok: !failed, ...result }, null, 2))
  else printReport(file, result, strict)
  return failed ? 1 : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().then(
    (code) => process.exit(code),
    (error) => {
      console.error(error.message)
      process.exit(2)
    }
  )
}
