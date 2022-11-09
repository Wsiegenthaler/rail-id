import { defaults, unset } from 'lodash-es'

import { grammar, semantics } from './parser'
import { buildResult, META_PATH } from './attributes/builders'


type Options = {
  metadata?: boolean,
  debug?: boolean
}

const Defaults: Options = { metadata: true, debug: false }

// Main
export default (code: string, options: Options = {}) => {
  defaults(options, Defaults)

  // Log parse trace if debug flag set
  if (options.debug) console.info(grammar.trace(code))

  let parseResult = grammar.match(code)
  
  if (parseResult.succeeded()) {
    const result = buildResult(semantics(parseResult).attrs())

    // Omit metadata according to options
    if (options.metadata === false) unset(result, META_PATH)

    return result
  } else {
    //TODO throw error with position and message
    throw new Error('parse failed! ' + parseResult.message)
  }
}