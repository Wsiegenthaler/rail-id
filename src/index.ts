import { MatchResult } from 'ohm-js'
import { defaults, unset } from 'lodash-es'

import { grammar, semantics } from './parser'
import { buildResult, META_PATH, RailID } from './attrs'


type Options = {
  metadata?: boolean,
  debug?: boolean
}

const Defaults: Options = { metadata: true, debug: false }

// Main
export default (input: string, options: Options = {}): RailID => {
  defaults(options, Defaults)

  // Log parse trace if debug flag set
  if (options.debug) console.info(grammar.trace(input).toString())

  let parseResult = grammar.match(input)
  
  if (parseResult.succeeded()) {
    const result = buildResult(semantics(parseResult).attrs())

    // Omit metadata according to options
    if (options.metadata === false) unset(result, META_PATH)

    return result
  } else {
    const e = new ParseError(parseResult, input)
    console.error(e)
    throw e
  }
}

// Parser error, assumes input is always single line
export class ParseError extends Error {
  public input: string
  public position: number
  public expected: string

  constructor(result: MatchResult, input: string) {
    super()
    this.input = input
    this.position = parseInt(result.message.match(/col (\d+):/)[1]) - 1
    this.expected = result.message.match(/Expected ([^\n]*)/)[1]
    this.message = `RailID encountered an error at position ${this.position} while parsing "${input}". Encountered "${input[this.position]}" but expected ${this.expected}.`
  }
}