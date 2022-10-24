// Strips non-numeric characters from value `n`, mostly for internal use
export const luhnClean = n => (n || '').toString().replaceAll(/[^0-9]/g, '')

// Kernel for generating the value to be multiplied with each digit at
// index `i` (i.e. 1, 2, 1, 2, 1, 2)
export const evenFactor = i => i % 2 + 1

// Kernel for generating the value to be multiplied with each digit at
// index `i` (i.e. 2, 1, 2, 1, 2, 1)
export const oddFactor = i => (i+1) % 2 + 1

// Computes sum used to generate luhn checksum digit
const luhnSum = (n, factor=evenFactor) => n.split('')
  .map((d, i) => parseInt(d) * factor(i))
  .flatMap(n => n.toString().split(''))
  .reduce((sum, c) => sum + parseInt(c), 0)

// Computes checksum digit for value `n`
export const luhn = (n, factor=evenFactor) => (10 - luhnSum(luhnClean(n), factor) % 10) % 10

// Verifies luhn checksum of value `n` with trailing checksum digit
export const luhnVerify = (n, factor=evenFactor) => [ luhnClean(n) ]
  .map(m => parseInt(m[m.length-1]) === luhn(m.slice(0, m.length-1), factor))
  .pop() && ((typeof n === 'string' && n.length > 1) || (Number.isInteger(n) && n > 9))
