import { zipObject } from 'lodash-es'


export type Country = { code: number, short: string, long: string }

export const readableCountry = (c: Country) => `${c.long} (${c.short})`

// List of UIC-defined countries
export const UICCountries: Country[] = [
  { code: 10, short: 'FI', long: 'Finland' },
  { code: 20, short: 'RU', long: 'Russia' },
  { code: 21, short: 'BY', long: 'Belarus' },
  { code: 22, short: 'UA', long: 'Ukraine' },
  { code: 23, short: 'MD', long: 'Moldova' },
  { code: 24, short: 'LT', long: 'Lithuania' },
  { code: 25, short: 'LV', long: 'Latvia' },
  { code: 26, short: 'EE', long: 'Estonia' },
  { code: 27, short: 'KZ', long: 'Kazakhstan' },
  { code: 28, short: 'GE', long: 'Georgia' },
  { code: 29, short: 'UZ', long: 'Uzbekistan' },
  { code: 30, short: 'KP', long: 'North Korea' },
  { code: 31, short: 'MN', long: 'Mongolia' },
  { code: 32, short: 'VN', long: 'Vietnam' },
  { code: 33, short: 'CN', long: 'China' },
  { code: 38, short: 'KOS', long: 'Kosovo' },
  { code: 40, short: 'CU', long: 'Cuba' },
  { code: 41, short: 'AL', long: 'Albania' },
  { code: 42, short: 'JP', long: 'Japan' },
  { code: 44, short: 'BA', long: 'Bosnia and Herzegovina, Serbia' },
  { code: 49, short: 'BA', long: 'Bosnia and Herzegovina' },
  { code: 50, short: 'BA', long: 'Bosnia and Herzegovina, Muslim-Croat' },
  { code: 51, short: 'PL', long: 'Poland' },
  { code: 52, short: 'BG', long: 'Bulgaria' },
  { code: 53, short: 'RO', long: 'Romania' },
  { code: 54, short: 'CZ', long: 'Czech Republic' },
  { code: 55, short: 'HU', long: 'Hungary' },
  { code: 56, short: 'SK', long: 'Slovakia' },
  { code: 57, short: 'AZ', long: 'Azerbaijan' },
  { code: 58, short: 'AM', long: 'Armenia' },
  { code: 59, short: 'KG', long: 'Kyrgyzstan' },
  { code: 60, short: 'IE', long: 'Ireland' },
  { code: 61, short: 'KR', long: 'South Korea' },
  { code: 62, short: 'ME', long: 'Montenegro' },
  { code: 65, short: 'MK', long: 'North Macedonia' },
  { code: 66, short: 'TJ', long: 'Tajikistan' },
  { code: 67, short: 'TM', long: 'Turkmenistan' },
  { code: 68, short: 'AF', long: 'Afghanistan' },
  { code: 70, short: 'GB', long: 'United Kingdom' },
  { code: 71, short: 'ES', long: 'Spain' },
  { code: 72, short: 'RS', long: 'Serbia' },
  { code: 73, short: 'GR', long: 'Greece' },
  { code: 74, short: 'SE', long: 'Sweden' },
  { code: 75, short: 'TR', long: 'Türkiye' },
  { code: 76, short: 'NO', long: 'Norway' },
  { code: 78, short: 'HR', long: 'Croatia' },
  { code: 79, short: 'SI', long: 'Slovenia' },
  { code: 80, short: 'DE', long: 'Germany' },
  { code: 81, short: 'AT', long: 'Austria' },
  { code: 82, short: 'LU', long: 'Luxembourg' },
  { code: 83, short: 'IT', long: 'Italy' },
  { code: 84, short: 'NL', long: 'Netherlands' },
  { code: 85, short: 'CH', long: 'Switzerland' },
  { code: 86, short: 'DK', long: 'Denmark' },
  { code: 87, short: 'FR', long: 'France' },
  { code: 88, short: 'BE', long: 'Belgium' },
  { code: 90, short: 'ET', long: 'Egypt' },
  { code: 91, short: 'TN', long: 'Tunisia' },
  { code: 92, short: 'DZ', long: 'Algeria' },
  { code: 93, short: 'MA', long: 'Morocco' },
  { code: 94, short: 'PT', long: 'Portugal' },
  { code: 95, short: 'IL', long: 'Israel' },
  { code: 96, short: 'IR', long: 'Iran' },
  { code: 97, short: 'SY', long: 'Syria' },
  { code: 98, short: 'LB', long: 'Lebanon' },
  { code: 99, short: 'IQ', long: 'Iraq' }
]

// Countries mapped by UIC numerical code
export const UICCountryCodeMap = zipObject(UICCountries.map(c => c.code), UICCountries)

// Countries mapped by short name
export const UICCountryShortMap = zipObject(UICCountries.map(c => c.short), UICCountries)
