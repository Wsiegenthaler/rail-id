import { Interval } from 'ohm-js/index'

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


const META_PATH = '_meta'
const META_FIELDS_PATH = `${META_PATH}.fields`

export enum FieldType {
    Scalar = 'scalar',
    Set = 'set'
}

export class Field<V> {
  public name: string
  public path: string
  public desc?: string
  public type: FieldType

  constructor(name: string, path: string, desc?: string, type:FieldType=FieldType.Scalar) {
    this.name = name
    this.path = path
    this.desc = desc
    this.type = type
  }

  value(value: V, desc?: string): ValueDef<V> {
    return new ValueDef(this, value, desc)
  }
}

export class ValueDef<V> {
  field: Field<V>
  value: V
  desc?: string

  constructor(field: Field<V>, value: V, desc?: string) {
    this.field = field
    this.value = value
    this.desc = desc
  }

  at(source: Interval, ...notes: Array<string>) {
    return new Attribute<V>(this, source, notes)
  }
}

export class Attribute<V> {
  valueDef: ValueDef<V>
  source: Interval
  notes: Array<string> = []

  constructor(value: ValueDef<V>, source: Interval, notes: Array<string>) {
    this.valueDef = value
    this.source = source
    this.notes = notes
  }
}

const applyScalars = (o: object, attrs: Array<Attribute<any>>): object => {
  // Apply values
  attrs.forEach(a => set(o, a.valueDef.field.path, a.valueDef.value))

  // Apply field metadata
  applyScalarMeta(o, attrs)

  return o
}

const applySets = (o: object, attrs: Array<Attribute<any>>): object => {
  // Apply values
  const setMap = groupBy(attrs, a => a.valueDef.field.path)
  toPairs(setMap)
    .map(([path, attrs]) => [path, attrs.map(a => a.valueDef.value)])
    .forEach(([path, v]) => set(o, path, v))

  // Apply field metadata
  applySetMeta(o, setMap)

  return o
}

const applyScalarMeta = (o: object, attrs: Array<Attribute<any>>): object => {
    // Build metadata updates
    const updates = zipObject(
      attrs.map(a => a.valueDef.field.path),
      attrs.map(a => ({
        type: a.valueDef.field.type,
        desc: a.valueDef.field.desc ?? '',
        source: a.source,
        notes: a.notes
    })))

    // Apply metadata
    const existing = get(o, META_FIELDS_PATH, {})
    set(o, META_FIELDS_PATH, assign(existing, updates))

    return o
}

const applySetMeta = (o: object, setMap: Dictionary<Array<Attribute<any>>>): object => {
    for (let path in setMap) {
      const attrs = setMap[path]

      // Build metadata updates for `set` fields
      const fieldUpdates = zipObject(
        attrs.map(a => a.valueDef.field.path),
        attrs.map(a => ({
          type: a.valueDef.field.type,
          length: attrs.length,
          desc: a.valueDef.field.desc,
      })))

      // Build metadata updates for values of the set
      const valueUpdates = zipObject(
        attrs.map((a, i) => `${a.valueDef.field.path}[${i}]`),
        attrs.map(a => ({
          name: a.valueDef.value,
          desc: a.valueDef.desc ?? '',
          notes: a.notes,
          source: a.source
      })))

      // Apply metadata
      const updates = merge(fieldUpdates, valueUpdates)
      const existing = get(o, META_FIELDS_PATH, {})
      set(o, META_FIELDS_PATH, assign(existing, updates))
    }

    return o
}

// Generate result object with attributes and their metadata
export const buildResult = (attrs: Array<Attribute<any>>): object => {
  const o = {}
  const [ scalars, sets ] = partition(attrs, a => a.valueDef.field.type === FieldType.Scalar)

  applyScalars(o, scalars) 
  applySets(o, sets)
  
  return o
}

// `Dictionary` type definition isn't included with lodash-es for some reason, defining it here
export interface Dictionary<T> {
  [index: string]: T;
}