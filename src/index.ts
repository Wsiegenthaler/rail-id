import { MatchResult } from 'ohm-js'
import { defaults, unset } from 'lodash-es'

import { grammar, semantics } from './parser'
import { META_PATH } from './attrs'
import { result, RailID } from './result'


export type Options = {
  metadata?: boolean
  logLevel?: 'debug' | 'warn' | 'error' | 'none'
}

const Defaults: Options = { metadata: true, logLevel: 'warn' }

const debugLog = (dataFn: () => any, options: Options) =>
  (options.logLevel! === 'debug') && console.debug(dataFn())

// Main
export default (input: string, options: Options = {}): RailID => {
  defaults(options, Defaults)

  // Log parse trace if debug flag set
  debugLog(() => grammar.trace(input).toString(), options)

  let parseResult = grammar.match(input)
  
  if (parseResult.succeeded()) {
    // Parse and generate attributes
    const attrs = semantics(parseResult).attrs()

    // Log attributes if debug flag set
    debugLog(() => attrs, options)

    // Build result object
    const r = result(attrs)

    // Omit metadata according to options
    if (options.metadata === false) unset(r, META_PATH)

    // Log warnings
    if (options.logLevel === 'warn' || options.logLevel === 'error')
      r._meta.warnings.forEach(w => console.warn('[rail-id] parse warning', w))

    return r
  } else {
    const e = new ParseError(parseResult, input)
    if (options.logLevel === 'error') console.error('[rail-id] parse error', e)
    throw e
  }
}

// Parser error, assumes input is always single line
export class ParseError extends Error {
  public type = 'rail-id:parse-error'
  public input: string
  public position: number
  public expected: string
  public found: string
  public incompleteInput = false
  public friendlyMessage: string

  constructor(result: MatchResult, input: string) {
    super()
    this.input = input
    const pos = (result.message ?? 'col -1').match(/col (\-?\d+):/) as RegExpMatchArray
    const exp = (result.message ?? 'Expected ???').match(/Expected ([^\n]*)/) as RegExpMatchArray
    this.position = parseInt(pos[1]) - 1
    this.expected = exp[1]
    if (this.input.length === this.position) {
      this.incompleteInput = true
      this.found = "<end of input>"
      this.message = `RailID encountered an error a while parsing "${input}". Encountered <end of input> but expected ${this.expected}.`
      this.friendlyMessage = `This code doesn't look right. It's too short!`
    } else {
      this.found = input[this.position]
      this.message = `RailID encountered an error at position ${this.position} while parsing "${input}". Encountered "${this.found}" but expected ${this.expected}.`
      this.friendlyMessage = `This code doesn't look right. Found "${this.found}" but expected ${this.expected}!`
    }
  }
}

// Utility to determine whether a value is an instance of `ParseError`
export const isParseError = (o: any) => (typeof o === 'object' && o.type === 'rail-id:parse-error')

// Re-exports
export * from './result'
export { META_PATH } from './attrs'
export { Country } from './defs/countries'
export { KeeperDef } from './defs/keepers'
export * from './attrs/common-values'
export * from './attrs/common'