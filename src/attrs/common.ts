import { Field, SetField, META_PATH } from '.'


// Raw Code (the raw input passed to the parser)
export const RawCode = new Field('Raw Code', `${META_PATH}.raw`)

// Code Type
const CodeType = new Field<string>('Code Type', `${META_PATH}.codeType`)

export const UICCode = CodeType.value('uic')

// UIC Checksum status
const ChecksumStatus = new Field<string>('UIC Checksum Status', `${META_PATH}.checksum`)

export const ChecksumPassed = ChecksumStatus.value('passed')
export const ChecksumFailed = ChecksumStatus.value('failed')
export const ChecksumAbsent = ChecksumStatus.value('absent')

// Warnings (a place to report oddities encountered during parsing)
export const ParseWarnings = new SetField('Parse Warnings', `${META_PATH}.warnings`)
