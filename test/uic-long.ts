import test from 'ava'
import { range } from 'lodash-es'

import { CountryByCode } from '../src/attrs/countries'
import { ChecksumStatus, ParseWarnings, CodeType } from '../src/attrs/common'
import { Traction, DieselLocomotive, ElectricLocomotive } from '../src/attrs/vehicles/tractive'

import { UICCountryCodeMap, UICCountries } from '../src/defs/countries'

import { eq, like, matches, throws } from './util'


test('whitespace 1', t => {
  const expected = [
    CodeType.value('UIC'),
    ChecksumStatus.value('passed'),
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
    ChecksumStatus.value('passed'),
    CountryByCode(80),
    DieselLocomotive,
    Traction.value('Diesel')
  ]

  matches('9280 1 218 455-4 D-DB', ...expected)(t)
  matches('  92801 218455 - 4 D - DB ', ...expected)(t)
  matches('9 2 8 0 1218455-4   D -DB', ...expected)(t)
})

test('checksum digit - exhaustive test', t => 
  range(0, 10).forEach(d => matches(`9280 1 218 455-${d}`, d == 4 ? ChecksumStatus.value('passed') : ChecksumStatus.value('failed'))(t)))

test('checksum digit - absent', t => matches(`9280 1 218 455`, ChecksumStatus.value('absent'))(t))

// Test each known UIC country in our definitions
UICCountries.forEach(c =>
  test(`country - ${c.code} - ${c.long.toLowerCase()}`,
    t => matches(`91 ${c.code} 4605 205`, CountryByCode(c.code))(t)))

// Ensure warnings are generated for unknown country codes
range(0, 100)
  .filter(d => !(d in UICCountryCodeMap))
  .map(d => d.toString().padStart(2, '0'))
  .forEach(code => 
    test(`country - invalid - ${code}`,
      matches(`91 ${code} 4605 205`, ParseWarnings.value(`Country code '${code}' doesn't appear to be a known value.`))))

// Generate tests for each known UIC locomotive/vehicle type
//TODO
