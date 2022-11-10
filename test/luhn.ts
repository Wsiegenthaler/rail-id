import test from 'ava'

import { luhn, luhnVerify } from '../src/util/luhn'

test('compute/verify - compute and verify checksum of value from wikipedia', t => {
  let v = '7992739871', expected = 3
  let check = luhn(v)
  t.is(check, expected, `generated check digit for ${v} should be ${expected}, not ${check}!`)

  let valid = luhnVerify(v + check)
  t.true(valid, `luhnVerify(${v + check}) should pass!`)
})

test('verify - single digit values always fail', t => {
  [0,1,2,3,4,5,6,7,8,9]
    .map(d => [luhnVerify(d), d])
    .forEach(([valid, d]) => t.false(valid, `luhnVerify(${d}) shouldn't pass!`))
})

test('verify - single digit values should always fail (string args)', t => {
  [0,1,2,3,4,5,6,7,8,9]
    .map(d => d.toString())
    .map(d => [luhnVerify(d), d])
    .forEach(([valid, d]) => t.false(valid, `luhnVerify('${d}') shouldn't pass! (string arg)`))
})

test('verify - empty/no string should fail', t => {
  t.false(luhnVerify(''))
  t.false(luhnVerify(null))
})
