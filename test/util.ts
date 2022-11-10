import { ExecutionContext } from 'ava'
import { cloneDeep, defaultsDeep } from 'lodash-es'

import railID from '../src/index'


// Deeply and immutably merges two objects, returning a new one. Fields of `o1` take
// presedence if values are defined in both objects.
const merge = (o1: object, o2: object) => defaultsDeep(cloneDeep(o1), o2)

// Parses code and ensures the result contains ALL expected values (Ava-provided `deepEqual`)
export const eq = (code: string, expected: object) => (t: ExecutionContext) =>
  t.deepEqual(railID(code, { metadata: false }), merge(expected, { meta: { code }}))

// Parses code and ensures the result is LIKE the expected value (Ava-provided `like`)
export const like = (code: string, expected: object) => (t: ExecutionContext) => t.like(railID(code), expected)

// Ensures parsing failes and an exception is thrown (Ava-provided `throws`)
export const throws = (code: string, expected?: object, message?: string) => (t: ExecutionContext) =>
  t.throws(() => railID(code), expected, message)