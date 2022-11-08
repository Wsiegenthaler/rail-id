import { Interval } from 'ohm-js/index'

import {
  assign,
  get,
  groupBy,
  isEqual,
  keys,
  merge,
  partition,
  set,
  some,
  toPairs,
  zipObject
} from 'lodash-es'

import { Dictionary } from '../util/common'


const META_PATH = '_meta'
const META_FIELDS_PATH = `${META_PATH}.fields`

type FieldType = 'scalar' | 'set'

abstract class AbstractField<V> {
  public readonly name: string
  public readonly path: string
  public readonly desc?: string

  abstract readonly type: FieldType

  constructor(name: string, path: string, desc?: string) {
    this.name = name
    this.path = path
    this.desc = desc
  }

  value(value: V, desc?: string): ValueDef<V> {
    return new ValueDef(this, value, desc)
  }
}

export class Field<V> extends AbstractField<V> {
  type: FieldType = 'scalar'
}

export class SetField<V> extends AbstractField<V> {
  type: FieldType = 'set'
}

export class ValueDef<V> {
  readonly field: Field<V>
  readonly value: V
  readonly desc?: string

  constructor(field: Field<V>, value: V, desc?: string) {
    this.field = field
    this.value = value
    this.desc = desc
  }

  // Used to represent an instance of this value for a particular part of the code
  at(source: Interval, ...notes: string[]) {
    return new Attr<V>(this, source, notes)
  }

  // Tests a result object for the presence of this field value
  matches(o: object): boolean {
    if (this.field.type === 'scalar')
      return isEqual(get(o, this.field.path, undefined), this.value)
    else if (this.field.type === 'set')
      return some(get(o, this.field.path, []), (val: V) => isEqual(val, this.value))
    else
      return false
  }
}

export class Attr<V> {
  def: ValueDef<V>
  source: Interval
  notes: string[] = []

  constructor(def: ValueDef<V>, source: Interval, notes: string[]) {
    this.def = def
    this.source = source
    this.notes = notes
  }
}

const applyScalars = (o: object, attrs: Attr<any>[]): object => {
  // Apply values
  attrs.forEach((a: Attr<any>) => set(o, a.def.field.path, a.def.value))

  // Apply field metadata
  applyScalarMeta(o, attrs)

  return o
}

const applySets = (o: object, attrs: Attr<any>[]): object => {
  // Apply values
  const setMap = groupBy(attrs, (a: Attr<any>) => a.def.field.path)
  toPairs(setMap)
    .map(([path, attrs]) => [path, attrs.map((a: Attr<any>) => a.def.value)])
    .forEach(([path, v]) => set(o, path, v))

  // Apply field metadata
  applySetMeta(o, setMap)

  return o
}

const applyScalarMeta = (o: object, attrs: Attr<any>[]): object => {
    // Build metadata updates
    const updates = zipObject(
      attrs.map((a: Attr<any>) => a.def.field.path),
      attrs.map((a: Attr<any>) => ({
        type: a.def.field.type,
        desc: a.def.field.desc ?? '',
        source: a.source,
        notes: a.notes
    })))

    // Apply metadata
    const existing = get(o, META_FIELDS_PATH, {})
    set(o, META_FIELDS_PATH, assign(existing, updates))

    return o
}

const applySetMeta = (o: object, setMap: Dictionary<Attr<any>[]>): object => {
    for (let path in setMap) {
      const attrs = setMap[path]

      // Build metadata updates for `set` fields
      const fieldUpdates = zipObject(
        attrs.map((a: Attr<any>) => a.def.field.path),
        attrs.map((a: Attr<any>) => ({
          type: a.def.field.type,
          length: attrs.length,
          desc: a.def.field.desc,
      })))

      // Build metadata updates for values of the set
      const valueUpdates = zipObject(
        attrs.map((a: Attr<any>, i: number) => `${a.def.field.path}[${i}]`),
        attrs.map((a: Attr<any>) => ({
          name: a.def.value,
          desc: a.def.desc ?? '',
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
export const buildResult = (attrs: Attr<any>[]): object => {
  const o = {}
  const [ scalars, sets ] = partition(attrs, (a: Attr<any>) => a.def.field.type === 'scalar')

  applyScalars(o, scalars) 
  applySets(o, sets)
  
  return o
}