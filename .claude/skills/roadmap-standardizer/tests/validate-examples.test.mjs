import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import { validateRoadmapText } from "../scripts/validate-roadmap.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const skillRoot = path.resolve(here, "..")
const repoRoot = path.resolve(skillRoot, "../../..")
const examplesDir = path.join(skillRoot, "references/examples")

const messages = (result, level) =>
  result.issues.filter((issue) => issue.level === level).map((issue) => issue.message)

test("mọi example *.output.md đạt validator (0 lỗi)", async () => {
  const outputs = (await readdir(examplesDir)).filter((name) => name.endsWith(".output.md"))
  assert.ok(outputs.length >= 3, "cần ít nhất 3 ví dụ")
  for (const name of outputs) {
    const result = await validateRoadmapText(await readFile(path.join(examplesDir, name), "utf8"))
    assert.equal(result.errors, 0, `${name}: ${messages(result, "error").join("; ")}`)
  }
})

test("01-table-and-details: gom thành tính năng, không tick hộ, giữ mâu thuẫn của nguồn", async () => {
  const result = await validateRoadmapText(
    await readFile(path.join(examplesDir, "01-table-and-details.output.md"), "utf8")
  )
  assert.equal(result.summary.phases, 2)
  assert.equal(result.summary.items, 0)
  assert.equal(result.summary.tasks, 6)
  assert.equal(result.summary.done, 2)
  assert.deepEqual(result.summary.statuses.phases, { completed: 1, planned: 1 })
  assert.ok(
    messages(result, "warning").some((text) => text.includes("Nền tảng cốt lõi") && text.includes("chưa tick")),
    "phải cảnh báo mâu thuẫn completed/task chưa tick của nguồn"
  )
})

test("02-flat-list: thiếu trạng thái thì để trống và chỉ cảnh báo", async () => {
  const result = await validateRoadmapText(
    await readFile(path.join(examplesDir, "02-flat-list.output.md"), "utf8")
  )
  assert.equal(result.summary.statuses.phases.unspecified, 1)
  assert.ok(messages(result, "warning").some((text) => text.includes("Các tính năng khác")))
})

test("ví dụ và file công khai không còn mã nội bộ, tuần tương đối, emoji trạng thái", async () => {
  const outputs = (await readdir(examplesDir))
    .filter((name) => name.endsWith(".output.md"))
    .map((name) => path.join(examplesDir, name))
  outputs.push(path.join(repoRoot, "src/modules/roadmap/content/public-roadmap.md"))
  for (const name of outputs) {
    const text = await readFile(name, "utf8")
    assert.doesNotMatch(text, /\bP\d+\.\d+\b|\bT-\d+\b|\bW\d+\s*[–-]\s*W\d+\b|[✅🔄📋🔜]/u, name)
  }
})

test("file công khai đang phục vụ trang đạt validator", async () => {
  const file = path.join(repoRoot, "src/modules/roadmap/content/public-roadmap.md")
  const result = await validateRoadmapText(await readFile(file, "utf8"))
  assert.equal(result.errors, 0, messages(result, "error").join("; "))
  assert.ok(result.summary.phases > 0)
})

test("phát hiện lỗi cố ý: trạng thái, ngày, progress, cấp heading, H1", async () => {
  const bad = [
    "# A",
    "# B",
    "### item trước phase",
    "## Phase",
    "- **Status:** done",
    "- **Completed:** 2026-02-30",
    "- **Progress:** 120",
    "#### group ngoài item",
  ].join("\n")
  const errors = messages(await validateRoadmapText(bad), "error").join("\n")
  for (const expected of [
    "Chỉ được có một heading H1",
    "đứng trước mọi phase",
    'Status "done" không hợp lệ',
    "Completed phải là",
    "Progress phải là",
    "đứng ngoài mọi item",
  ]) {
    assert.ok(errors.includes(expected), `thiếu lỗi: ${expected}\n${errors}`)
  }
})

test("tài liệu rỗng báo thiếu H1 và thiếu phase", async () => {
  const errors = messages(await validateRoadmapText(""), "error")
  assert.ok(errors.some((text) => text.includes("Thiếu tiêu đề H1")))
  assert.ok(errors.some((text) => text.includes("Không có phase")))
})
