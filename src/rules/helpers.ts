import { Node } from "ohm-js"
import { Rule } from '../util/common'

// Factory which creates a function that applies rules to a set of digits, producing
// an array of `ValueDef`s. This includes both single digit rules which are applied to
// the leading digit, as well as double digit rules which are applied to a concatenation
// of both digits.
export const applyDigitRules = (leadingDigitRules: Rule[], doubleDigitRules: Rule[]) => (d1: Node, d2: Node) => [
  ...applySingleDigitRules(leadingDigitRules)(d1),
  ...applyDoubleDigitRules(doubleDigitRules)(d1, d2)
]

// Factory which creates a function that applies rules to a set of digits, producing
// an array of `ValueDef`s. The given rules are applied to a concatenation of both digits.
export const applyDoubleDigitRules = (doubleDigitRules: Rule[]) => (d1: Node, d2: Node) => {
  // Create artificial `source` and `sourceString` by combining both parse nodes
  const dd = (d1.sourceString + d2.sourceString).replaceAll(/[^0-9]/g, '')
  const ddSource = d1.source.coverageWith(d2.source)
  
  return doubleDigitRules
    .filter(r => r.pattern.test(dd))
    .flatMap(r => r.defs)
    .map(def => def.at(ddSource))
}

// Factory which creates a function that applies rules to a single digit, producing
// an array of `ValueDef`s.
export const applySingleDigitRules = (singleDigitRules: Rule[]) => (d: Node) =>
  singleDigitRules
    .filter(r => r.pattern.test(d.sourceString))
    .flatMap(r => r.defs)
    .map(def => def.at(d.source))
