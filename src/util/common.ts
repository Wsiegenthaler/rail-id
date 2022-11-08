import { zipObject } from 'lodash-es'

import { ValueDef } from '../attributes/builders'

//TODO deprecate
export const attributeMap = attrs => zipObject(attrs.map(a => a.key), attrs.map(a => a.value))

//TODO deprecate
export const sourceMap = attrs => zipObject(attrs.map(a => a.key), attrs.map(a => ({ start: a.source.startIdx, end: a.source.endIdx })))

// Regex pattern to be applied to an ohm `Node` `sourceString` and the associated attribute defs
export interface Rule { pattern: RegExp, defs: ValueDef<any>[] }

// `Dictionary` type definition isn't included with lodash-es for some reason, defining it here
export interface Dictionary<T> {
    [index: string]: T
}