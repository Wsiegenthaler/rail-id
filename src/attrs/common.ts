import { Field, SetField, META_PATH } from '.'


// Raw Code (the raw input passed to the parser)
export const RawCode = new Field<string>('Raw Code', `${META_PATH}.raw`)

// Code Type
type CodeType = 'UIC'
export const CodeType = new Field<CodeType>('Code Type', `${META_PATH}.type`)

// UIC Checksum status
type ChecksumStatus = 'passed' | 'failed' | 'absent'
export const ChecksumStatus = new Field<ChecksumStatus>('UIC Checksum Status', `${META_PATH}.checksum`)

// Warnings (a place to report oddities encountered during parsing)
export const ParseWarnings = new SetField<string>('Parse Warnings', `${META_PATH}.warnings`)
