import { ExecutionContext } from 'ava'
import { get, keys, set } from 'lodash-es'

import railID from '../src/index'
import { buildResult, META_FIELDS_PATH, META_PATH, RailID, ValueDef } from '../src/attrs'


// Strips `source` field from result object metadata so it's not included in `match` tests
const stripSource = (o: RailID) => {
  keys(get(o, META_FIELDS_PATH) ?? []).forEach(k => set(o, `${META_FIELDS_PATH}['${k}'].source`, undefined))
  return o
}

// Parses code and ensures the result contains ALL expected values (Ava-provided `deepEqual`)
export const eq = (code: string, expected: object) => (t: ExecutionContext) =>
  t.deepEqual(railID(code, { metadata: false }), expected)

// Parses code and ensures the result is LIKE the expected value (Ava-provided `like`)
export const like = (code: string, expected: object) => (t: ExecutionContext) => t.like(railID(code), expected)

// Ensures parsing failes and an exception is thrown (Ava-provided `throws`)
export const throws = (code: string, expected?: object, message?: string) => (t: ExecutionContext) =>
  t.throws(() => railID(code), expected, message)

// Parses code and ensures the result expected attribute value(s)
export const matches = (code: string, ...expected: ValueDef<any>[]) => (t: ExecutionContext) =>
  t.like(stripSource(railID(code)), buildResult(expected.map(v => v.absent())))
