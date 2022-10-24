import test from 'ava'

import railID from '../src/index.mjs'
import { UICCountryByCode, UICCountryList } from '../src/uic/countries.mjs'

import { eq, like } from './util.mjs'


test('whitespace 1', t => {
  let expected = {
    electric: true,
    country: UICCountryByCode[85],
    meta: {
      codeType: 'uic',
      uicChecksum: 'pass'
    }
  }

  eq('91 85 4605 205-4 CH-BLS', expected, t)
  eq(' 91  85  4605	205 - 4 CH-BLS', expected, t)
  eq('91854605205-4 CH-BLS', expected, t)
  eq('	91 85 4605 205-4 CH-BLS	', expected, t)
  eq('9 1 8 5 4 6 0 5 2 0 5 - 4 CH-BLS', expected, t)
})

test('whitespace 2', t => {
  let expected = {
    diesel: true,
    country: UICCountryByCode[80],
    meta: {
      codeType: 'uic',
      uicChecksum: 'pass'
    }
  }

  eq('9280 1 218 455-4 D-DB', expected, t)
  eq('  92801 218455 - 4 D - DB ', expected, t)
  eq('9 2 8 0 1218455-4   D -DB', expected, t)
})

test('exhaustive checksum test', t => {
  let pass = { meta: { uicChecksum: 'pass' } }
  let fail = { meta: { uicChecksum: 'fail' } }

  // Only the example with checksum digit '4' should pass
  like('9280 1 218 455-1', fail, t)
  like('9280 1 218 455-2', fail, t)
  like('9280 1 218 455-3', fail, t)
  like('9280 1 218 455-4', pass, t)
  like('9280 1 218 455-5', fail, t)
  like('9280 1 218 455-6', fail, t)
  like('9280 1 218 455-7', fail, t)
  like('9280 1 218 455-8', fail, t)
  like('9280 1 218 455-9', fail, t)
})


// Generate tests for each known UIC country in our list
UICCountryList.forEach(c => 
  test(`country - ${c.code} - ${c.long.toLowerCase()}`, t => {
    let expected = {
      country: c,
      electric: true,
      meta: {
        codeType: 'uic',
        uicChecksum: 'absent'
      }
    }
  
    eq(`91 ${c.code} 4605 205`, expected, t)
  }))

// Generate tests for each known UIC locomotive/vehicle type
//TODO
