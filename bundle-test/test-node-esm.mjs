import railID from '../dist/rail-id.mjs'

let code = '91 85 4605 205-4'
let id = railID(code)

if (typeof id === 'object' && id.vehicleType == 'locomotive') {
  console.log(`railID("${code}") =`, id)
  console.log('SUCCESS')
} else console.log('FAILED')
