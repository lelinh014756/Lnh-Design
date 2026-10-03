import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const localesDir = path.join(__dirname, 'dictionaries')
const localeDirs = {
  vi: path.join(localesDir, 'vi'),
  en: path.join(localesDir, 'en'),
}

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'))

const flattenKeyPaths = (value, prefix = '') => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }

  const entries = Object.entries(value)
  if (entries.length === 0) {
    return [prefix]
  }

  return entries.flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    return flattenKeyPaths(child, nextPrefix)
  })
}

const compareSets = (left, right) => ({
  onlyLeft: [...left].filter((item) => !right.has(item)).sort(),
  onlyRight: [...right].filter((item) => !left.has(item)).sort(),
})

const main = async () => {
  const [viFiles, enFiles] = await Promise.all([
    readdir(localeDirs.vi),
    readdir(localeDirs.en),
  ])

  const fileDiff = compareSets(new Set(viFiles), new Set(enFiles))
  if (fileDiff.onlyLeft.length || fileDiff.onlyRight.length) {
    console.error('Namespace file mismatch detected.')
    if (fileDiff.onlyLeft.length) {
      console.error(`Only in vi: ${fileDiff.onlyLeft.join(', ')}`)
    }
    if (fileDiff.onlyRight.length) {
      console.error(`Only in en: ${fileDiff.onlyRight.join(', ')}`)
    }
    process.exit(1)
  }

  const mismatches = []

  for (const fileName of [...viFiles].sort()) {
    const [viJson, enJson] = await Promise.all([
      readJson(path.join(localeDirs.vi, fileName)),
      readJson(path.join(localeDirs.en, fileName)),
    ])

    const keyDiff = compareSets(
      new Set(flattenKeyPaths(viJson)),
      new Set(flattenKeyPaths(enJson)),
    )

    if (keyDiff.onlyLeft.length || keyDiff.onlyRight.length) {
      mismatches.push({ fileName, ...keyDiff })
    }
  }

  if (mismatches.length) {
    console.error(`Dictionary parity failed in ${mismatches.length} namespace file(s).`)
    for (const mismatch of mismatches) {
      console.error(`- ${mismatch.fileName}`)
      if (mismatch.onlyLeft.length) {
        console.error(`  Only in vi: ${mismatch.onlyLeft.join(', ')}`)
      }
      if (mismatch.onlyRight.length) {
        console.error(`  Only in en: ${mismatch.onlyRight.join(', ')}`)
      }
    }
    process.exit(1)
  }

  console.log(`Dictionary parity passed for ${viFiles.length} namespace files.`)
}

main().catch((error) => {
  console.error('Dictionary parity verification crashed.')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
