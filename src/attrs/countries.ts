import { Field, ValueDef } from '.'
import { UICCountryCodeMap } from '../defs/countries'
import { ParseWarnings } from './vehicles/common-fields'

const CountryField = new Field<object>('Country', 'country')

export const CountryByCode = (code: number): ValueDef<any> => {
  const def = UICCountryCodeMap[code]
  if (def === undefined) {
    return ParseWarnings.value(`Country code '${code}' doesn't appear to be a known value.`)
  } else {
    return CountryField.value(UICCountryCodeMap[code])
  }
}