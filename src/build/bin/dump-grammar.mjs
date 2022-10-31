#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'fs/promises'
import path from 'path'

const program = new Command()

program
  .name('dump-grammar')
  .description('Utility which dumps Ohm grammar text where the grammar is defined as the default export of an ES module')

program
  .command('dump <mjsFile> [outFile]', { isDefault: true })
  .description('output the grammar to `outFile`, or to stdout if not specified')
  .action(dump)

program
  .command('dump-all <inDir>')
  .description('recursively outputs all grammars (*.ohm.mjs) found in `dir`')
  .option('-o, --out-dir <outDir>', 'override output directory')
  .action(dumpAll)

program.parse(process.argv)

//////////////////////////////////////////////////////////////////////////////////////

async function dump(mjsFile, outFile) {
  const mjsPath = path.join(process.cwd(), mjsFile)
  const module = await import(mjsPath)
  const grammar = module.default
  if (outFile) {
    try {
      await fs.mkdir(path.dirname(outFile), { recursive: true })
      await fs.writeFile(outFile, grammar)
      console.log(`[success] ${mjsFile} ===> ${outFile}`)
    } catch (err) {
      console.error(err)
    }
  } else console.log(grammar)
}

async function dumpAll(inDir, options) {
  (await walk(path.relative(process.cwd(), inDir)))
    .filter(s => /\.ohm\.mjs$/g.test(s))
    .map(s => ({ in: s, out: s.slice(0, s.length-4) }))
    .map(o => options.outDir ? { ...o, out: path.join(options.outDir, o.out) } : o)
    .forEach(o => dump(o.in, o.out))
}

async function walk(dir) {
  let files = await fs.readdir(dir)
  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file)
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) return walk(filePath)
    else if(stats.isFile()) return filePath
  }))

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}