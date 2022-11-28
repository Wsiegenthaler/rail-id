import { filter, find, get, isEqual, range, some, toPairs } from 'lodash-es'
import { Interval } from 'ohm-js/index'
import { RailID, Source } from '../result'


export const META_PATH = '_meta'

export type Attrs = Attr<any>[]

export type FieldType = 'scalar' | 'set'

type FieldOptionals<V> = { desc?: string, displayFn?: displayFn<V> }

type displayFn<V> = (v: V) => string

abstract class AbstractField<V> {

  public readonly name: string
  public readonly path: string
  public readonly desc?: string

  readonly displayFn?: displayFn<V>

  abstract readonly type: FieldType

  constructor(name: string, path: string, optionals: FieldOptionals<V> = {}) {
    this.name = name
    this.path = path

    this.desc = optionals.desc
    this.displayFn = optionals.displayFn
  }

  // Create new `ValueDef<V>` for this field
  value(value: V, desc?: string): ValueDef<V> {
    return new ValueDef(this, value, desc)
  }

  // Compare this field with another (only checks field type)
  is(other: AbstractField<any>): boolean {
    return this.type === other.type && this.path === other.path
  }

  // Finds the first instance of this field in a list of `Attr<V>`
  find(attrs: Attr<any>[]): Attr<V> | undefined {
    return find(attrs, a => a.def.field.is(this))
  }

  // Finds all instances of this field in a list of `Attr<V>`
  findAll(attrs: Attr<any>[]): Attrs {
    return filter(attrs, a => a.def.field.is(this))
  }
}

export class Field<V> extends AbstractField<V> {
  type: FieldType = 'scalar'
}

export class SetField<V> extends AbstractField<V> {
  type: FieldType = 'set'
}

export class ValueDef<V> {
  public readonly field: Field<V>
  public readonly value: V
  public readonly desc?: string
  public readonly footnotes: string[]

  constructor(field: Field<V>, value: V, desc?: string, footnotes?: string[]) {
    this.field = field
    this.value = value
    this.desc = desc
    this.footnotes = footnotes ?? []
  }

  // Creates new instance of this def with the speficied footnotes
  notes(...footnotes: string[]): ValueDef<V> {
    return new ValueDef<V>(this.field, this.value, this.desc, [ ...footnotes, ...this.footnotes ])
  }

  // Used to represent an instance of this value for a particular part of the code
  at(...intervals: Interval[]) {
    const source = intervals.map(iv => range(iv.startIdx, iv.endIdx)).flat()
    return this.atSource(source)
  }

  // Used to represent an instance of this value for a particular part of the code
  atSource(...source: Source[]) {
    return new Attr<V>(this, source.flat(), this.footnotes)
  }

  // Used to represent a value which doesn't correspond to a specific part of the code.
  absent() {
    return new Attr<V>(this, [], this.footnotes)
  }

  // Tests a result object for the presence of this field value
  matches(o: RailID): boolean {
    if (this.field.type === 'scalar')
      return isEqual(get(o, this.field.path, undefined), this.value)
    else if (this.field.type === 'set')
      return some(get(o, this.field.path, []), (val: V) => isEqual(val, this.value))
    else
      return false
  }

  // Compares the value of this def with that of another def (ignores description and footnotes)
  compare(other: ValueDef<any>) {
    return this.field.is(other.field) && isEqual(this.value, other.value)
  }

  // Generate a human display version of this fields value
  displayValue(): string {
    const vType = typeof this.value

    // If a literal then use `toString()`
    if (vType === 'string' || vType === 'number') return this.value.toString()

    // Use `Field`-provided function if one exists
    if (this.field.displayFn) return this.field.displayFn(this.value)

    // If an object (should be by this point) then make a decent key/value string
    if (vType === 'object') return toPairs(this.value as object).map(([k, v]) => `${k}=${v}`).join(', ')

    // Give up
    return ''
  }
}

export class Attr<V> {
  public readonly def: ValueDef<V>
  public readonly source: Source = []
  public readonly footnotes: string[] = []

  constructor(def: ValueDef<V>, source: Source, footnotes: string[]) {
    this.def = def
    this.source = source
    this.footnotes = footnotes
  }

  compare(other: Attr<any>) {
    return this.def.compare(other.def)
  }
}