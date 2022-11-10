#!/usr/bin/env ts-node

import { Command } from 'commander'
import fs from 'fs/promises'
import path from 'path'

const program = new Command()

program
  .name('dump-grammar')
  .description('utility which dumps raw ohm grammar text as defined by the default export of a TS module')

program
  .command('dump <grammarFile> [outFile]', { isDefault: true })
  .description('dumps the raw ohm grammar text for the module specified by `grammarFile`. output is written to stdout or to `outFile`')
  .action(dump)

program
  .command('dump-all <inDir>')
  .description('recursively dumps the raw text of all ohm grammar modules (*.ohm.ts) found in `inDir`')
  .option('-o, --out-dir <outDir>', 'override output directory')
  .action(dumpAll)

program.parse(process.argv)

//////////////////////////////////////////////////////////////////////////////////////

async function dump(grammarFile, outFile) {
  const grammarPath = path.join(process.cwd(), grammarFile)
  const module = await import(grammarPath)
  const grammar = module.default
  if (outFile) {
    try {
      await fs.mkdir(path.dirname(outFile), { recursive: true })
      await fs.writeFile(outFile, grammar)
      console.log(`[success] ${grammarFile} ===> ${outFile}\n`)
    } catch (err) {
      console.error(err)
    }
  } else console.log(grammar)
}

const isModule = s => /\.ohm\.ts$/g.test(s)

async function dumpAll(inDir, options) {
  (await walk(path.relative(process.cwd(), inDir)))
    .filter(s => isModule(s))
    .map(s => ({ in: s.slice(0, s.length-3), out: s.slice(0, s.length-3) }))
    .map(o => options.outDir ? { ...o, out: path.join(options.outDir, o.out) } : o)
    .forEach(o => dump(o.in, o.out))
}

async function walk(dir): Promise<string[]> {
  let files = await fs.readdir(dir)
  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file)
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) return await walk(filePath)
    else if(stats.isFile()) return filePath
  })) as string[]

  return files.reduce((all: string[], folderContents) => all.concat(folderContents), [])
}