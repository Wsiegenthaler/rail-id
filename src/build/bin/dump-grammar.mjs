#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'fs'
import path from 'path'

const program = new Command()

program
  .command('dump <mjsGrammar> [outFile]', { isDefault: true })
  .description('output the grammar to `outFile`, or to stdout if not specified')
  .action((mjsGrammar, outFile) => {
    const mjsGrammarPath = path.join(process.cwd(), mjsGrammar)
    import(mjsGrammarPath).then(module => {
      const grammar = module.default
      if (outFile) {
        try {
          fs.writeFileSync(outFile, grammar)
          console.log(`Grammar defined in \`${mjsGrammar}\' has been saved to \'${outFile}\'`)
        } catch (err) {
          console.error(err)
        }
      } else console.log(grammar)
    })
  })

program.parse(process.argv)