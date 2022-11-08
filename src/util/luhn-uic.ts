import { luhn, luhnClean, luhnVerify, oddFactor } from './luhn'


// Computes luhn checksum digit of UIC railway codes
export const uicChecksum = (code: string) => luhn(luhnClean(code), oddFactor)

// Verifies luhn checksum of UIC railway codes
export const uicVerify = (code: string) => [ luhnClean(code) ].map(n => n.length == 12 && luhnVerify(n, oddFactor)).pop()
