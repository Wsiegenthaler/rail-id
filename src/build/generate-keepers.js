const fs = require("fs")
const { parse } = require("csv-parse")
const _ = require("lodash")


generate('../../data/keeper-data.csv', '../uic/keepers.mjs')


////////////////////////////////////////////////////////////////////

function generate(inFile, outFile) {
  let rows = []
  
  fs.createReadStream(inFile)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", r => rows.push(r.map(clean)))
    .on("end", () => {
      let body = _.sortBy(rows, [3, 1])
        .filter(r => r[4].toLowerCase() === 'in use')
        .map(r => `  '${r[1].toUpperCase()}': { country: '${r[3].toUpperCase()}', company: '${r[2]}', website: '${r[5]}', otif: ${r[6].toUpperCase() === 'OTIF' ? 1 : 0} }`)
        .join(',\n')
      let data = template(body)
      save(outFile, data)
    })
    .on("error", error => console.log(error.message))
}

function save(to, data) {
  fs.writeFile(to, data, err => {
    if (err) console.error(err)
    else console.log(`File written successfully: ${to}\n`);
  })
}

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
      // 3) Move the exported CSV to './scripts/keeper-data.csv' and run 'generate-keepers.js'.
      //
      // 4) Ensure 'src/uic/keepers.mjs' reflects the latest data and that there are no syntax errors.
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
