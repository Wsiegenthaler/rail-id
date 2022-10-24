import { zipObject } from 'lodash-es'


export const attributeMap = attrs => zipObject(attrs.map(a => a.key), attrs.map(a => a.value))

export const sourceMap = attrs => zipObject(attrs.map(a => a.key), attrs.map(a => ({ start: a.source.startIdx, end: a.source.endIdx })))
