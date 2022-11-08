import { Field } from './builders'
import { UICCountryCodeMap } from '../uic/countries'

const CountryField = new Field<object>('Country', 'country')

export const CountryByCode = (code: number) => CountryField.value(UICCountryCodeMap[code])