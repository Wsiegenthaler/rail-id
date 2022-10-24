import { luhn, luhnClean, luhnVerify, oddFactor } from './luhn.mjs'


// Computes luhn checksum digit of UIC railway codes
export const uicChecksum = code => luhn(luhnClean(code), oddFactor)

// Verifies luhn checksum of UIC railway codes
export const uicVerify = code => [ luhnClean(code) ].map(n => n.length == 12 && luhnVerify(n, oddFactor)).pop()
