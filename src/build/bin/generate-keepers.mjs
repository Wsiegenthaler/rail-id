#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'fs'
import { parse } from 'csv-parse'
import { sortBy } from 'lodash-es'

const program = new Command()

program.name('generate-keepers')

program
  .command('generate <inCsvFile> [outTsFile]', { isDefault: true })
  .description('output the keeper definitions as an TS module. output is written to stdout or `outTsFile`')
  .action((inCsvFile, outTsFile) => {
    let rows = []
 
    // Read and parse data from stream
    fs.createReadStream(inCsvFile)
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on("data", r => rows.push(r.map(clean)))
      .on("end", () => {
        // Generate output content
        let body = sortBy(rows, [3, 1])
          .map(r => {
            const website = (r[5] ?? '')
            const otif = (r[6] ?? '').toLowerCase() !== 'otif'
            const status = (r[4] ?? '').toLowerCase().trim()
              .replace(/ı/g, 'i') // hack to replace errant turkish character present in data file

            let optional = ''
            if (website.length > 0) optional += `, website: '${website}'`
            if (otif)               optional += `, otif: true`

            return `  { vkm: '${r[1].toUpperCase()}', country: '${r[3].toUpperCase()}', company: '${r[2]}', status: '${status}'${optional} }`
          })
          .join(',\n')
        let data = template(body)

        if (outTsFile) {
          // Save output to file
          fs.writeFile(outTsFile, data, err => {
            if (err) console.error(err)
            else console.log(`Keeper definitions successfully written to: ${outTsFile}\n`);
          })
        } else console.log(data)
      })
      .on("error", error => console.log(error.message))
  })

program.parse(process.argv)


////////////////////////////////////////////////////////////////////

function template(body) {
  return `//
      // This module contains UIC 'keeper codes' (VKMs) registered with the European Railway
      // Agency and made publicly available on their website. The process for updating this
      // file is as follows:
      //
      // 1) Navigate to https://www.era.europa.eu and download the latest data. The
      //    spreadsheet can be found by searching for "VKM list".
      //
      // 2) Export the data as a CSV using any spreadsheet application and remove non-data header
      //    rows from the beginning of the file.
      //
      // 3) Run 'generate-keepers' script to convert CSV to TS module:
      //
      //    \`node src/build/bin/generate-keepers.mjs <csv> <mjs>\`
      //
      // 4) Verify the generated module reflects the latest CSV data and that there are no syntax errors.
      //
     
      import { zipObject } from 'lodash-es'

      export type KeeperStatus = 'in use' | 'blocked' | 'revoked'

      export interface KeeperDef {
        vkm: string,
        status: KeeperStatus,
        country: string,
        company: string,
        website?: string,
        otif?: boolean
      }

      export const keepers: KeeperDef[] = [
      ${body}
      ]

      export const UICKeeperCodeMap = zipObject(keepers.map(k => k.vkm), keepers)
    `.replaceAll(/^      /gm, '')
}

function clean(s) {
  return s.trim()
    .replaceAll(/'/g, "\\'")
    .replaceAll(/\n/g, '')
    .replaceAll(/\t/g, ' ')
}
