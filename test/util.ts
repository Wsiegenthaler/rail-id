import { ExecutionContext } from 'ava'
import { get, isEqual, keys, set } from 'lodash-es'

import railID from '../src/index'
import { META_PATH, ValueDef } from '../src/attrs'
import { RailID, result } from '../src/result'


// Strips `source` field from result object metadata so it's not included in `match` tests
const stripSource = (o: RailID) => {
  keys(o[META_PATH].fields ?? []).forEach(k => set(o[META_PATH].fields, `${k}.source`, undefined))
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

// Generates test fail message for set attributes
const setMessage = (path: string, set0: any[], set1: any[]) => {
  const setStr = (set: any[]) => set.length > 0 ?  set.map(s => `\n  - ${JSON.stringify(s)}`).join() : '  - Empty set'
  return `Expected to find value(s) at path '${path}' in set:\n * Expected:${setStr(set0)}\n * Actual:${setStr(set1)}`
}

// Parses code and ensures the result expected attribute value(s)
export const matches = (code: string, ...expected: ValueDef<any>[]) => (t: ExecutionContext) => {
  const r1 = stripSource(railID(code, { logLevel: 'none' }))
  for (const e of expected) {
    const path = e.field.path
    const r0 = result([ e.absent() ], code, code)
    const v0 = get(r0, path)
    if (e.field.type === 'scalar') {
      const v1 = get(r1, path)
      t.true(isEqual(v0, v1), `Expected value at path '${path}' to be '${v0}' but actual is '${v1}'`)
    } else {
      const set0 = get(r0, path), set1 = get(r1, path)
      t.true(!set0.some(v0 => !set1.some(v1 => isEqual(v0, v1))), setMessage(path, set0, set1))
    }
  }
}