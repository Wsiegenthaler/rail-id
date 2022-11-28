import {
  find,
  groupBy,
  mapValues,
  partition,
  set,
  toPairs,
  values,
} from 'lodash-es'

import { ParseWarning } from './attrs/common'

import { Attr, Attrs, FieldType, META_PATH } from './attrs'
import { ParseWarnings } from './attrs/common'
import { Dictionary } from './util/common'

export interface RailID {
  [META_PATH]: {
    type: string
    raw: string
    fields: FieldMap
    warnings: ParseWarning[]
  }
}

export interface FieldMap {
  [path: string]: FieldMeta<any>
}

export type FieldMeta<V> = ScalarFieldMeta<V> | SetFieldMeta<V>

interface AbstractFieldMeta {
  type: FieldType
  name: string
  desc: string
  path: string
}

export interface ValueMeta<V> {
  value: V
  displayValue: string
  desc: string
  footnotes: string[]
  source: Source
}

export interface ScalarFieldMeta<V> extends AbstractFieldMeta {
  type: 'scalar'
  valueMeta: ValueMeta<V>
}

export interface SetFieldMeta<V> extends AbstractFieldMeta {
  type: 'set'
  valueMetas: ValueMeta<V>[]
}

export type Source = number[]

// Dedupe/merge attributes by field, noting conflicts as warnings (only applies to scalars)
const dedupeAttrs = (attrs: Attr<any>[]): Attrs => {
  const [ scalars, sets ] = partition(attrs, a => a.def.field.type === 'scalar')

  const dedupedScalars = values(mapValues(groupBy(scalars, a => a.def.field.path), attrs => {
    // Only one attribute for this field, return it
    if (attrs.length === 1) return attrs[0]

    // Found two or more attributes mapping to the same field path, verify that they all have the same value
    const aRef = attrs[0] // reference attribute to compare with the rest
    const conflict = find(attrs.slice(1), a2 => !aRef.compare(a2))

    // If a conflict exists then produce warning, otherwise merge into single attribute
    if (conflict) {
      // Produce parse warning to document the conflict
      const valType = typeof aRef.def.field.value
      const msg = valType === 'string' || valType === 'number' ?
      `This code contains conflicting "${aRef.def.field.name}" information: "${aRef.def.value}" versus "${conflict.def.value}` :
      `This code contains conflicting "${aRef.def.field.name}" information`
      const warning = ParseWarnings
        .value({ type: 'conflict', subType: 'field-conflict', msg })
        .atSource([ ...aRef.source, ...conflict.source ])
     
      // Return reference attribute and warning
      return [ aRef, warning ]
    } else {
      // Produce merged version of attribute
      const source = attrs.flatMap(a => a.source)
      const footnotes = attrs.flatMap(a => a.footnotes)
      return new Attr<any>(aRef.def, source, footnotes)
    }
  })).flat()
  
  return [ ...dedupedScalars, ...sets ]
}

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
        displayValue: a.def.displayValue(),
        desc: a.def.desc ?? '',
        footnotes: a.def.footnotes,
        source: a.source
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
        displayValue: a.def.displayValue(),
        desc: a.def.desc ?? '',
        footnotes: a.footnotes,
        source: a.source
      }))
    }
  }

  return o
}

// Generate result object with attribute values and their metadata
export const result = (attrs: Attr<any>[]): RailID => {
  const o: RailID = { [META_PATH]: { type: '', raw: '', fields: {}, warnings: [] } }

  const deduped = dedupeAttrs(attrs)

  const [ scalars, sets ] = partition(deduped, a => a.def.field.type === 'scalar')

  applyScalars(o, scalars) 
  applySets(o, sets)
  
  return o
}