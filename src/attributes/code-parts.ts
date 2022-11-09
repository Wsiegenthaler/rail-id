import { Field, META_PATH } from "./builders";

const rootPath = `${META_PATH}.parts`

export const SourceString = new Field('Source String', `${rootPath}.sourceString`)

export const TypePart = new Field<string>('Type Code', `${rootPath}.type`)

export const CountryPart = new Field<string>('Country Code', `${rootPath}.country`)

export const VehicleDetailPart = new Field<string>('Vehicle Detail', `${rootPath}.detail`)

export const SerialPart = new Field<string>('Serial Number', `${rootPath}.serial`)

export const ChecksumDigitPart = new Field<string>('Checksum Digit', `${rootPath}.checksum`)

//TODO add to parser
export const KeeperPart = new Field<string>('Vehicle Keeper Marking (VKM)', `${rootPath}.keeper`)
