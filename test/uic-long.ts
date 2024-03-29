import test from 'ava'
import { range, some } from 'lodash-es'

import { CountryByCode } from '../src/attrs/countries'
import { ChecksumStatus, ParseWarnings, CodeType } from '../src/attrs/common'
import { Traction, DieselLocomotive, ElectricLocomotive } from '../src/attrs/vehicles/tractive'

import { UICCountries } from '../src/defs/countries'

import { matches } from './util'


test('whitespace 1', t => {
  const expected = [
    CodeType.value('UIC'),
    ChecksumStatus.value('Passed'),
    CountryByCode(85),
    ElectricLocomotive,
    Traction.value('Electric')
  ]

  matches('91 85 4605 205-4 CH-BLS', ...expected)(t)
  matches(' 91  85  4605	205 - 4 CH-BLS', ...expected)(t)
  matches('91854605205-4 CH-BLS', ...expected)(t)
  matches('	91 85 4605 205-4 CH-BLS	', ...expected)(t)
  matches('9 1 8 5 4 6 0 5 2 0 5 - 4 CH-BLS', ...expected)(t)
})

test('whitespace 2', t => {
  const expected = [
    CodeType.value('UIC'),
    ChecksumStatus.value('Passed'),
    CountryByCode(80),
    DieselLocomotive,
    Traction.value('Diesel')
  ]

  matches('9280 1 218 455-4 D-DB', ...expected)(t)
  matches('  92801 218455 - 4 D - DB ', ...expected)(t)
  matches('9 2 8 0 1218455-4   D -DB', ...expected)(t)
})

test('checksum digit - exhaustive test', t => 
  range(0, 10).forEach(d => matches(`9280 1 218 455-${d}`, d == 4 ? ChecksumStatus.value('Passed') : ChecksumStatus.value('Failed'))(t)))

test('checksum digit - absent', matches(`9280 1 218 455`, ChecksumStatus.value('Absent')))

// Test each known UIC country in our definitions
UICCountries.forEach(c =>
  test(`country - ${c.code} - ${c.long.toLowerCase()}`,
    matches(`91 ${c.code} 4605 205`, CountryByCode(c.code))))

// Ensure warnings are generated for unknown country codes
range(0, 100)
  .filter(d => !some(UICCountries, c => d === c.code))
  .map(d => d.toString().padStart(2, '0'))
  .forEach(code => 
    test(`country - invalid - ${code}`,
      matches(`91 ${code} 4605 205`, ParseWarnings.value({
        type: 'unknown-value',
        subType: 'country',
        msg: `Country code '${code}' doesn't appear to be a known value`
      }))))

// Generate tests for each known UIC locomotive/vehicle type
//TODO
