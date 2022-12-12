import { defaults, unset } from 'lodash-es'

import { grammar, semantics } from './parser'
import { META_PATH } from './attrs'
import { result, RailID } from './result'
import { ParseError } from './errors'


export type Options = {
  /**
   * Whether to include field metadata in the result such as field names,
   * descriptions, footnotes, sourcemaps, human-friendly display values,
   * etc. (default: `true`)
   */
  metadata?: boolean

  /**
   * Log level (default: `warn`)
   */
  logLevel?: 'debug' | 'warn' | 'error' | 'none'
}

const Defaults: Options = {
  metadata: true,
  logLevel: 'warn'
}

const debugLog = (dataFn: () => any, options: Options) =>
  (options.logLevel! === 'debug') && console.debug(dataFn())

// Main
export default (input: string, options: Options = {}): RailID => {
  defaults(options, Defaults)

  let parseResult = grammar.match(input)
  
  if (parseResult.succeeded()) {
    // Generate attributes
    const attrs = semantics(parseResult).attrs()

    // Log attributes if debug flag set
    debugLog(() => attrs, options)

    // Build result object
    const r = result(attrs)

    // Omit metadata according to options
    if (!options.metadata) unset(r, META_PATH)

    // Log warnings
    if (options.logLevel === 'warn' || options.logLevel === 'error')
      r._meta.warnings.forEach(w => console.warn('[rail-id] parse warning', w))

    return r
  } else {
    const e = new ParseError(parseResult, input)

    // Log parse trace if debug flag set
    debugLog(() => grammar.trace(input).toString(), options)

    if (options.logLevel === 'error') console.error('[rail-id] parse error', e)

    throw e
  }
}

// Re-exports
export * from './result'
export * from './errors'
export { Country } from './defs/countries'
export { KeeperDef } from './defs/keepers'
export { META_PATH } from './attrs'
export * from './attrs/common-values'
export * from './attrs/common'