// Key/value element representing an aspect of the locomotive/railcar
// and it's query string source map
export const Attr = (key, value, source) => ({ key, value, source })

// Flag attribute where value is always `true`
export const Flag = (key, source) => Attr(key, true, source)

// An `Attr` where the value is the entire parse node `sourceString`
export const NodeAttr = (key, node) => Attr(key, node.sourceString, node.source)

// Like `Attr` but represents an aspect of the code instead of the locomotive/railcar (no sourcemap)
export const Meta = (key, value) => ({ key, value, meta: true })