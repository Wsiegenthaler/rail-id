import prettyjson from 'prettyjson'

import railID from './src/index.mjs'

//TODO
// relevant pages
// 59 top-level (vehicle type)
// 66 wagon types


//let result = railID('91 85 4605 205-4 CH-BLS')
//let result = railID('A-OBB 73 81 52-91 403-7') // austrian couchette car (siemens nightjet)
//let result = railID('H-START 61 55 19-91 305-2') // hungarian 1st class carriage
//let result = railID('A-OBB 73 81 85-90 527-5') // first class austrian compartment in wien
//let result = railID('91 85 4 610425-1') // old sbb image from wikipedia type designations page
//let result = railID('A-OBB 9181 1116 079-5') // austrien siemens es64 'taurus' locomotive 
//let result = railID('A-OBB 9181 1116 209-8') // more taurus
//let result = railID('A-OBB 9181 1116 232-0') // more taurus
//let result = railID('A-OBB 9181 1116 060-5') // more taurus
//let result = railID('A-OBB 9181 1116 135-5') // more taurus
//let result = railID('31 81 2892 009-3') // https://github.com/wayrunner/uic-number-detector/blob/master/img/uic_test.jpgj
let result = railID('73815291403-7')

console.log(prettyjson.render(result))


let n = 7500
let start = Date.now()
for (var i=0; i<n; i++) {
  let result = railID('91 85 4605 205-4 CH-BLS')
  result += '1'
}
let elapsed = Date.now() - start
console.log(`${elapsed/n} ms per (${elapsed} total)`)