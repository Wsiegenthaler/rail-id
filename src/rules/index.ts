import { some } from 'lodash-es'
import { Node } from 'ohm-js'

import { ValueDef } from '../attrs'

// Regex pattern to be applied to an ohm `Node` `sourceString` and the associated attribute defs
export interface Rule { pattern: RegExp, defs: ValueDef<any>[] }

// Tests string `s` against regex pattern `p` for a total match. Useful for ensuring that
// the entire string matches without having to sandwich your pattern with `^` and `$`.
const completeMatch = (s: string, p: RegExp) => {
  const parts = s.split(p)
  return parts.length === 2 && !some(parts, r => r.length > 0)
}

// Factory which creates a function that applies rules to a set of digits, producing
// an array of `ValueDef`s. This includes both single digit rules which are applied to
// the leading digit, as well as double digit rules which are applied to a concatenation
// of both digits.
export const applyDigitRules = (leadingDigitRules: Rule[], doubleDigitRules: Rule[]) => (d1: Node, d2: Node) => [
  ...applyRules(leadingDigitRules)(d1),
  ...applyDoubleDigitRules(doubleDigitRules)(d1, d2)
]

// Factory which creates a function that applies rules to a set of digits, producing
// an array of `ValueDef`s. The given rules are applied to a concatenation of both digits.
export const applyDoubleDigitRules = (doubleDigitRules: Rule[]) => (d1: Node, d2: Node) => {
  // Create artificial `source` and `sourceString` by combining both parse nodes
  const dd = (d1.sourceString + d2.sourceString).replaceAll(/[^0-9]/g, '')
  const ddSource = d1.source.coverageWith(d2.source)
  
  return doubleDigitRules
    .filter(r => completeMatch(dd, r.pattern))
    .flatMap(r => r.defs)
    .map(def => def.at(ddSource))
}

// Factory which creates a function that applies rules to the content of a single parse node,
// producing an array of `ValueDef`s.
export const applyRules = (rules: Rule[]) => (d: Node) =>
  rules
    .filter(r => completeMatch(d.sourceString, r.pattern))
    .flatMap(r => r.defs)
    .map(def => def.at(d.source))