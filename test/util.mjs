import { cloneDeep, defaultsDeep } from 'lodash-es'

import railID from '../src/index.mjs'


// Deeply and immutably merges two objects, returning a new one. Fields of `o1` take
// presedence if values are defined in both objects.
const merge = (o1, o2) => defaultsDeep(cloneDeep(o1), o2)

// Parses code and ensures the result contains ALL expected values (Ava-provided `deepEqual`)
export const eq = (code, expected, t) => t.deepEqual(railID(code, { sourceMap: false }), merge(expected, { meta: { code }}))

// Parses code and ensures the result is LIKE the expected value (Ava-provided `like`)
export const like = (code, expected, t) => t.like(railID(code), expected)
