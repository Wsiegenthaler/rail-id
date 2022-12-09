import test from 'ava'

import { luhn, luhnValidate } from '../src/util/luhn'

test('compute/validate - compute and validate checksum of value from wikipedia', t => {
  let v = '7992739871', expected = 3
  let check = luhn(v)
  t.is(check, expected, `generated check digit for ${v} should be ${expected}, not ${check}!`)

  let valid = luhnValidate(v + check)
  t.true(valid, `luhnValidate(${v + check}) should pass!`)
})

test('validate - single digit values always fail', t => {
  [0,1,2,3,4,5,6,7,8,9]
    .map(d => [luhnValidate(d), d])
    .forEach(([valid, d]) => t.false(valid, `luhnValidate(${d}) shouldn't pass!`))
})

test('validate - single digit values should always fail (string args)', t => {
  [0,1,2,3,4,5,6,7,8,9]
    .map(d => d.toString())
    .map(d => [luhnValidate(d), d])
    .forEach(([valid, d]) => t.false(valid, `luhnValidate('${d}') shouldn't pass! (string arg)`))
})

test('validate - empty/no string should fail', t => {
  t.false(luhnValidate(''))
  t.false(luhnValidate(null))
})
