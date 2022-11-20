import { MatchResult } from "ohm-js"

// Parser error, assumes input is always single line
export class ParseError extends Error {
  public type = 'rail-id:parse-error'
  public input: string
  public position: number
  public expected: string
  public found: string
  public incompleteInput = false
  public friendlyMessage: string

  constructor(result: MatchResult, input: string) {
    super()
    this.input = input
    const pos = (result.message ?? 'col -1').match(/col (\-?\d+):/) as RegExpMatchArray
    const exp = (result.message ?? 'Expected ???').match(/Expected ([^\n]*)/) as RegExpMatchArray
    this.position = parseInt(pos[1]) - 1
    this.expected = exp[1]
    if (this.input.length === this.position) {
      this.incompleteInput = true
      this.found = "<end of input>"
      this.message = `RailID encountered an error a while parsing "${input}". Encountered <end of input> but expected ${this.expected}.`
      this.friendlyMessage = `This code doesn't look right. It's too short!`
    } else {
      this.found = input[this.position]
      this.message = `RailID encountered an error at position ${this.position} while parsing "${input}". Encountered "${this.found}" but expected ${this.expected}.`
      this.friendlyMessage = `This code doesn't look right. Found "${this.found}" but expected ${this.expected}!`
    }
  }
}

// Utility to determine whether a value is an instance of `ParseError`
export const isParseError = (o: any) => (typeof o === 'object' && o.type === 'rail-id:parse-error')