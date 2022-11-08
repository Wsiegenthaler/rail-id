import test from 'ava'
import { range } from 'lodash-es'

import { UICCountryCodeMap, UICCountries } from '../src/uic/countries'

import { eq, like, throws } from './util'


test('whitespace 1', t => {
  let expected = {
    vehicleType: 'locomotive',
    electric: true,
    country: UICCountryCodeMap[85],
    meta: {
      codeType: 'uic',
      uicChecksum: 'pass'
    }
  }

  eq('91 85 4605 205-4 CH-BLS', expected)(t)
  eq(' 91  85  4605	205 - 4 CH-BLS', expected)(t)
  eq('91854605205-4 CH-BLS', expected)(t)
  eq('	91 85 4605 205-4 CH-BLS	', expected)(t)
  eq('9 1 8 5 4 6 0 5 2 0 5 - 4 CH-BLS', expected)(t)
})

test('whitespace 2', t => {
  let expected = {
    vehicleType: 'locomotive',
    diesel: true,
    country: UICCountryCodeMap[80],
    meta: {
      codeType: 'uic',
      uicChecksum: 'pass'
    }
  }

  eq('9280 1 218 455-4 D-DB', expected)(t)
  eq('  92801 218455 - 4 D - DB ', expected)(t)
  eq('9 2 8 0 1218455-4   D -DB', expected)(t)
})

test('exhaustive checksum test', t => {
  let pass = { meta: { uicChecksum: 'pass' } }
  let fail = { meta: { uicChecksum: 'fail' } }

  // 4 should pass, the rest should fail
  range(0, 10).map(d => like(`9280 1 218 455-${d}`, d == 4 ? pass : fail)(t))
})

// Generate tests for every known UIC country in our list
UICCountries.forEach(c => test(`country - ${c.code} - ${c.long.toLowerCase()}`, t => like(`91 ${c.code} 4605 205`, { country: c })(t)))

// Ensure parsing fails for unknown country codes
range(0, 100)
  .filter(d => !(d in UICCountryCodeMap))
  .map(d => d.toString().padStart(2, '0'))
  .forEach(code => 
    test(`country - invalid - ${code}`, throws(`91 ${code} 4605 205`)))

// Generate tests for each known UIC locomotive/vehicle type
//TODO
