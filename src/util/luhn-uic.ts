import { luhn, luhnClean, luhnValidate, oddFactor } from './luhn'


// Computes luhn checksum digit of UIC railway codes
export const uicChecksum = (code: string) => luhn(luhnClean(code), oddFactor)

// Validates luhn checksum of UIC railway codes
export const uicValidate = (code: string) => [ luhnClean(code) ].map(n => n.length == 12 && luhnValidate(n, oddFactor)).pop()
