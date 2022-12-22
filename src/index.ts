import { defaults } from 'lodash-es'

import { grammar, semantics } from './parser'
import { result, RailID } from './result'
import { ParseError } from './errors'
import { cleanRawInput } from './util/common'


export type Options = {
  /**
   * Whether to include field metadata in the result such as field names,
   * descriptions, footnotes, sourcemaps, human-friendly display values,
   * etc. (default: `true`)
   */
  metadata?: boolean

  /**
   * Field/value metadata (descriptions, footnotes, etc) are expressed in
   * Markdown syntax. Setting this to `false` renders these values as
   * plain text. (default: `true`)
   */
  markdown?: boolean

  /**
   * Log level (default: `warn`)
   */
  logLevel?: 'debug' | 'warn' | 'error' | 'none'
}

export const Defaults: Options = {
  metadata: true,
  markdown: true,
  logLevel: 'warn'
}

const debugLog = (dataFn: () => any, options: Options) =>
  (options.logLevel! === 'debug') && console.debug(dataFn())


// Main
export default (rawInput: string, options: Options = {}): RailID => {
  defaults(options, Defaults)

  // Clean input
  const cleanInput = cleanRawInput(rawInput)

  let parseResult = grammar.match(cleanInput)
  
  if (parseResult.succeeded()) {
    // Generate attributes
    const attrs = semantics(parseResult).attrs()

    // Log attributes if debug flag set
    debugLog(() => attrs, options)

    // Build result object
    const r = result(attrs, cleanInput, rawInput, options)

    // Log warnings
    if (options.logLevel === 'warn' || options.logLevel === 'error')
      r._meta.warnings.forEach(w => console.warn('[rail-id] parse warning', w))

    return r
  } else {
    const e = new ParseError(parseResult, cleanInput, rawInput)

    // Log parse trace if debug flag set
    debugLog(() => grammar.trace(cleanInput).toString(), options)

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