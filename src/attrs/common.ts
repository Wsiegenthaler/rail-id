import { Field, SetField, META_PATH } from '.'


// Code Type
type CodeType = 'UIC'
export const CodeType = new Field<CodeType>('Code Type', `${META_PATH}.type`)

// UIC Checksum status
type ChecksumStatus = 'Passed' | 'Failed' | 'Absent'
export const ChecksumStatus = new Field<ChecksumStatus>('UIC Checksum Status', `${META_PATH}.checksum`)

// Warnings (a place to report problems or other oddities encountered during parsing)
type ParseWarningType = 'unknown-value' | 'unexpected-value' | 'conflict' | 'checksum'
export type ParseWarning = {
  type: ParseWarningType
  subType?: string
  msg: string
}
const displayParseWarning = (w: ParseWarning) => w.msg
export const ParseWarnings = new SetField<ParseWarning>('Parse Warnings', `${META_PATH}.warnings`, { displayFn: displayParseWarning })
