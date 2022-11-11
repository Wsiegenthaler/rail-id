import {
  assign,
  get,
  groupBy,
  merge,
  partition,
  set,
  toPairs,
  zipObject
} from 'lodash-es'

import { Attr, META_FIELDS_PATH, META_PATH, RailID } from './attrs'
import { Dictionary } from './util/common'
  

type Source = { start: number, end: number, len: number }

const applyScalars = (o: RailID, attrs: Attr<any>[]): RailID => {
  // Apply values
  attrs.forEach((a: Attr<any>) => set(o, a.def.field.path, a.def.value))

  // Apply field metadata
  applyScalarMeta(o, attrs)

  return o
}

const applySets = (o: RailID, attrs: Attr<any>[]): RailID => {
  // Apply values
  const setMap = groupBy(attrs, (a: Attr<any>) => a.def.field.path)
  toPairs(setMap)
    .map(([path, attrs]) => [path, attrs.map((a: Attr<any>) => a.def.value)])
    .forEach(([path, v]) => set(o, path, v))

  // Apply field metadata
  applySetMeta(o, setMap)

  return o
}

const applyScalarMeta = (o: RailID, attrs: Attr<any>[]): RailID => {
    // Build metadata updates
    const updates = zipObject(
      attrs.map((a: Attr<any>) => a.def.field.path),
      attrs.map((a: Attr<any>) => ({
        fieldName: a.def.field.name,
        fieldType: a.def.field.type,
        desc: a.def.field.desc ?? '',
        source: sourceResult(a),
        footnotes: a.footnotes
    })))

    // Apply metadata
    const existing = get(o, META_FIELDS_PATH, {})
    set(o, META_FIELDS_PATH, assign(existing, updates))

    return o
}

const applySetMeta = (o: RailID, setMap: Dictionary<Attr<any>[]>): RailID => {
    for (let path in setMap) {
      const attrs = setMap[path]

      // Build metadata updates for `set` fields
      const fieldUpdates = zipObject(
        attrs.map((a: Attr<any>) => a.def.field.path),
        attrs.map((a: Attr<any>) => ({
          fieldName: a.def.field.name,
          fieldType: a.def.field.type,
          length: attrs.length,
          desc: a.def.field.desc,
      })))

      // Build metadata updates for values of the set
      const valueUpdates = zipObject(
        attrs.map((a: Attr<any>, i: number) => `${a.def.field.path}[${i}]`),
        attrs.map((a: Attr<any>) => ({
          name: a.def.value,
          desc: a.def.desc ?? '',
          footnotes: a.footnotes,
          source: sourceResult(a)
      })))

      // Apply metadata
      const updates = merge(fieldUpdates, valueUpdates)
      const existing = get(o, META_FIELDS_PATH, {})
      set(o, META_FIELDS_PATH, assign(existing, updates))
    }

    return o
}

// Convert Ohm `Interval` to `Source` to be included in the result
const sourceResult = (a: Attr<any>): Source | undefined => {
  if (a?.source === undefined) return undefined

  const { startIdx, endIdx } = a.source!
  return { start: startIdx, end: endIdx, len: endIdx - startIdx }
}

// Generate result object with attributes and their metadata
export const result = (attrs: Attr<any>[]): RailID => {
  const o = { [META_PATH]: {} }
  const [ scalars, sets ] = partition(attrs, (a: Attr<any>) => a.def.field.type === 'scalar')

  applyScalars(o, scalars) 
  applySets(o, sets)
  
  return o
}