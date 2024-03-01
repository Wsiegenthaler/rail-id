import { remove as removeDiacritics } from 'diacritics'


// `Dictionary` type definition isn't included with lodash-es for some reason, defining it here
export interface Dictionary<T> {
    [index: string]: T
}

// Removes `combining diacritics` unicode characters from string (U+0300 - U+036F)
const removeCombiningDiacritics = (s: string) =>
  s.split('').filter(c => c.charCodeAt(0) < 768 || c.charCodeAt(0) > 879).join('') 

// Removes miscellaneous unwanted characters
const removeZeroWidthSpaces = (s: string) =>
  s.split('').filter(c => c.charCodeAt(0) !== 8203).join('') 

// Reddies input code for parsing by:
// 1) Removing redundant whitespace
// 2) Replacing tabs with spaces
// 3) Removing diacritic unicode characters, include 'combining diacritics'
// 4) Removing zero-width spaces
//
// All but (3) are unessential for parsing but provide cleaner display/sourcemaps
export const cleanRawInput = (rawInput: string) => [ rawInput.replaceAll(/\s+/g, ' ') ]
  .map(removeCombiningDiacritics)
  .map(removeDiacritics)
  .map(removeZeroWidthSpaces)
  .pop()

