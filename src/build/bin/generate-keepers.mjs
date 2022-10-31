#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'fs'
import { parse } from 'csv-parse'
import * as _ from 'lodash-es'

const program = new Command()

program
  .command('generate <inCsvFile> [outMjsFile]', { isDefault: true })
  .description('output the generated keeper definitions to `outMjsFile`, or to stdout if not specified')
  .action((inCsvFile, outMjsFile) => {
    let rows = []
 
    // Read and parse data from stream
    fs.createReadStream(inCsvFile)
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on("data", r => rows.push(r.map(clean)))
      .on("end", () => {
        // Generate output content
        let body = _.sortBy(rows, [3, 1])
          .filter(r => r[4].toLowerCase() === 'in use')
          .map(r => `  '${r[1].toUpperCase()}': { country: '${r[3].toUpperCase()}', company: '${r[2]}', website: '${r[5]}', otif: ${r[6].toUpperCase() === 'OTIF' ? 1 : 0} }`)
          .join(',\n')
        let data = template(body)

        if (outMjsFile) {
          // Save output to file
          fs.writeFile(outMjsFile, data, err => {
            if (err) console.error(err)
            else console.log(`Keeper definitions successfully written to: ${outMjsFile}\n`);
          })
        } else console.log(data)
      })
      .on("error", error => console.log(error.message))
  })

program.parse(process.argv)


//generate('../../data/keeper-data.csv', '../uic/keepers.mjs')
// node src/build/bin/generate-keepers.mjs ../../data/keeper-data.csv ../uic/keepers.mjs


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
      // 3) Run 'generate-keepers' script to convert CSV to ES module:
      //
      //    \`node src/build/bin/generate-keepers.mjs <csv> <mjs>\`
      //
      // 4) Verify the generated module reflects the latest CSV data and that there are no syntax errors.
      //
     
      import { mapValues } from 'lodash-es'
       
      export default mapValues({
      ${body}
      }, (o, vkm) => ({ vkm, ...o }))
    `.replaceAll(/^      /gm, '')
}

function clean(s) {
  return s.trim()
    .replaceAll(/'/g, "\\'")
    .replaceAll(/\n/g, '')
    .replaceAll(/\t/g, ' ')
}
