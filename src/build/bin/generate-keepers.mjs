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
            const vkm = r[1].toUpperCase()
            const country = r[3].toUpperCase()
            const company = r[2]

            const website = (r[5] ?? '')
            const otif = (r[6] ?? '').toLowerCase() === 'otif'
            const status = (r[4] ?? '').toLowerCase().trim()
              .replace(/ı/g, 'i') // hack to replace errant turkish character present in data file

            return `  ['${vkm}', '${country}', '${company}', '${status}', '${website}', ${otif ? 0 : 1}]`
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

      const keeperData: any[] = [
      ${body}
      ]

      export const keepers: KeeperDef[] =
        keeperData.map(d => ({
          vkm: d[0],
          country: d[1],
          company: d[2],
          status: d[3],
          website: d[4].length > 0 ? d[4] : undefined,
          otif: d[5] === 1 ? true : undefined
        }))

      export const UICKeeperCodeMap = zipObject(keepers.map(k => k.vkm), keepers)
    `.replaceAll(/^      /gm, '')
}

function clean(s) {
  return s.trim()
    .replaceAll(/'/g, "\\'")
    .replaceAll(/\n/g, '')
    .replaceAll(/\t/g, ' ')
}
