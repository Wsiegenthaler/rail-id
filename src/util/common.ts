import { zipObject } from 'lodash-es'


//TODO deprecate
export const attributeMap = attrs => zipObject(attrs.map(a => a.key), attrs.map(a => a.value))

//TODO deprecate
export const sourceMap = attrs => zipObject(attrs.map(a => a.key), attrs.map(a => ({ start: a.source.startIdx, end: a.source.endIdx })))

// `Dictionary` type definition isn't included with lodash-es for some reason, defining it here
export interface Dictionary<T> {
    [index: string]: T;
}