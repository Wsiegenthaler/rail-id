import { defaults, partition, sortBy, unset } from 'lodash-es'

import { grammar, semantics } from './parser.mjs'
import { attributeMap, sourceMap } from './util/common.mjs'


// Returns parse results as an unprocessed array of key/value pairs (attribute objects)
export const railIDAttrs = s => {
  let parseResult = grammar.match(s)

  // Log parse trace if debug flag set
  if (options.debug)  console.info(grammar.trace(code))
  
  if (parseResult.succeeded()) {
    return semantics(parseResult).weston()
  } else {
    throw new Error('parse failed! ' + parseResult.message)
  }
}

// Main entry point
export default (code, options={}) => {

  // Default options
  defaults(options, { sourceMap: true })

  // Parse code for attributes
  let attrs = railIDAttrs(code)

  // Partition out meta attributes
  let [ mainAttrs, metaAttrs ] = partition(attrs, a => !a.meta)

  // Build meta object (info derived about the code)
  let meta = {
    code,
    sourceMap: sourceMap(mainAttrs),
    ...attributeMap(metaAttrs)
  }

  // Omit sourceMaps according to options
  if (!options.sourceMap) unset(meta, 'sourceMap')

  // Build and return final result
  return { meta, ...attributeMap(mainAttrs) }
}