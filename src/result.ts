import {
  groupBy,
  partition,
  set,
  toPairs,
} from 'lodash-es'

import { Attr, FieldType, META_PATH } from './attrs'
import { Dictionary } from './util/common'

export interface RailID {
  [META_PATH]: {
    type: string
    raw: string
    fields: FieldMap,
    warnings: string[]
  }
}

export interface FieldMap {
  [path: string]: FieldMeta<any>
}

export type FieldMeta<V> = ScalarFieldMeta<V> | SetFieldMeta<V>

interface AbstractFieldMeta {
  type: FieldType,
  name: string
  desc: string,
  path: string
}

export interface ValueMeta<V> {
  value: V
  desc: string
  footnotes: string[]
  source?: Source
}

export interface ScalarFieldMeta<V> extends AbstractFieldMeta {
  type: 'scalar'
  valueMeta: ValueMeta<V>
}

export interface SetFieldMeta<V> extends AbstractFieldMeta {
  type: 'set'
  valueMetas: ValueMeta<V>[]
}

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
    // Add field metadata to field map for each scalar attribute
    for (const i in attrs) {
      const a = attrs[i]
      const field = a.def.field
    
      o[META_PATH].fields[field.path] = {
        type: 'scalar',
        name: field.name,
        desc: field.desc ?? '',
        path: field.path,
        valueMeta: {
          value: a.def.value,
          desc: a.def.desc ?? '',
          footnotes: a.def.footnotes,
          source: attrSource(a)
        }
      }
    }

    return o
}

const applySetMeta = (o: RailID, setMap: Dictionary<Attr<any>[]>): RailID => {
    // Add field metadata to field map for each group of attributes with the same path
    for (let path in setMap) {
      const attrs = setMap[path]
      const field = attrs[0].def.field

      o[META_PATH].fields[path] = {
        type: 'set',
        name: field.name,
        desc: field.desc ?? '',
        path: path,
        valueMetas: attrs.map(a => ({
          value: a.def.value,
          desc: a.def.desc ?? '',
          footnotes: a.footnotes,
          source: attrSource(a)
        }))
      }
    }

    return o
}

// Convert Ohm `Interval` to `Source` to be included in the result
const attrSource = (a: Attr<any>): Source | undefined => {
  if (a?.source === undefined) return undefined

  const { startIdx, endIdx } = a.source!
  return { start: startIdx, end: endIdx, len: endIdx - startIdx }
}

// TODO dedup redundant fields, logging ParseWarnings when their values conflict
// TODO revise source/interval to support disjoint mapping of portions of the code

// Generate result object with attribute values and their metadata
export const result = (attrs: Attr<any>[]): RailID => {
  const o: RailID = { [META_PATH]: { type: '', raw: '', fields: {}, warnings: [] }
  }
  const [ scalars, sets ] = partition(attrs, (a: Attr<any>) => a.def.field.type === 'scalar')

  applyScalars(o, scalars) 
  applySets(o, sets)
  
  return o
}