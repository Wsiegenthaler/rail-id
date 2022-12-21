import { MatchResult } from "ohm-js"

// Parser error, assumes input is always single line
export class ParseError extends Error {
  public type = 'rail-id:parse-error'
  public cleanInput: string
  public rawInput: string
  public position: number
  public expected: string
  public found: string
  public incompleteInput = false
  public friendlyMessage: string

  constructor(result: MatchResult, cleanInput: string, rawInput: string) {
    super()
    this.cleanInput = cleanInput
    this.rawInput = rawInput
    const pos = (result.message ?? 'col -1').match(/col (\-?\d+):/) as RegExpMatchArray
    const exp = (result.message ?? 'Expected ???').match(/Expected ([^\n]*)/) as RegExpMatchArray
    this.position = parseInt(pos[1]) - 1
    this.expected = exp[1]
    if (this.cleanInput.length === this.position) {
      this.incompleteInput = true
      this.found = "<end of input>"
      this.message = `RailID encountered an error a while parsing "${this.cleanInput}". Encountered <end of input> but expected ${this.expected}.`
      this.friendlyMessage = `This code doesn't look right. It's too short!`
    } else {
      this.found = this.cleanInput[this.position]
      this.message = `RailID encountered an error at position ${this.position} while parsing "${this.cleanInput}". Encountered "${this.found}" but expected ${this.expected}.`
      this.friendlyMessage = `This code doesn't look right. Found "${this.found}" but expected ${this.expected}!`
    }
  }
}

// Utility to determine whether a value is an instance of `ParseError`
export const isParseError = (o: any) => (typeof o === 'object' && o.type === 'rail-id:parse-error')