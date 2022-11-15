import { Field, META_PATH } from '.'

const rootPath = `${META_PATH}.parts`

export const TypePart = new Field<string>('Type Code', `${rootPath}.type`)

export const CountryPart = new Field<string>('Country Code', `${rootPath}.country`)

export const VehicleDetailPart = new Field<string>('Vehicle Detail', `${rootPath}.detail`)

export const SerialPart = new Field<string>('Serial Number', `${rootPath}.serial`)

export const ChecksumDigitPart = new Field<string>('Checksum Digit', `${rootPath}.checksum`)

//TODO add to parser
export const KeeperCountryPart = new Field<string>('Keeper Marking (Country)', `${rootPath}.keeper.country`)
export const KeeperCompanyPart = new Field<string>('Keeper Marking (Company)', `${rootPath}.keeper.company`)
export const KeeperMarkingPart = new Field<string>('Keeper Marking (VKM)', `${rootPath}.keeper.marking`)
