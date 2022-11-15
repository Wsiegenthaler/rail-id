import { Field, ValueDef } from '.'
import { Country, readableCountry, UICCountryCodeMap, UICCountryShortMap } from '../defs/countries'
import { ParseWarnings } from './common'


const CountryField = new Field<Country>('Country', 'country', { readableFn: readableCountry })

export const CountryByCode = (code: number) => {
  const def = UICCountryCodeMap[code]
  if (def === undefined) {
    return ParseWarnings.value({
      type: 'unknown-value',
      subType: 'country',
      msg: `Country code '${code.toString().padStart(2, '0')}' doesn't appear to be a known value`
    })
  } else {
    return CountryField.value(def)
  }
}

export const CountryByShortCode = (short: string): ValueDef<Country> | undefined => {
  const def = UICCountryShortMap[short]
  return (def !== undefined) ? CountryField.value(def) : undefined
}