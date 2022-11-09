import ohm, { TerminalNode } from 'ohm-js'
import { find } from 'lodash-es'
import { IterationNode, Node, NonterminalNode } from 'ohm-js'

import { luhnClean } from './util/luhn'
import { uicVerify } from './util/luhn-uic'
import { uicPassengerTypeCode, uicTractiveTypeCode, uicWagonTypeCode } from './uic/types'

import { Attr, Attrs } from './attributes/builders'
import { CountryByCode } from './attributes/countries'
import * as C from './attributes/vehicles/common-fields'
import * as P from './attributes/code-parts'

import grammarStr from './uic/grammar.ohm'


export const grammar = ohm.grammar(grammarStr)

export const semantics = grammar.createSemantics()
  .addOperation('attrs', {

    // --------------------------- Root expression -----------------------------------------

    UICCode(this: NonterminalNode, inner: NonterminalNode): Attrs {
      const childAttrs = inner.attrs()

      // Checksum validation
      let checksumStatus = C.ChecksumAbsent.absent()
      const checksumPart = find(childAttrs, (a: Attr<any>) => a.def.field.is(P.ChecksumDigitPart))
      if (checksumPart) {
        const digits = luhnClean(this.sourceString)
        checksumStatus = (digits.length == 12 && uicVerify(digits)) ?
          C.ChecksumPassed.at(checksumPart.source) :
          C.ChecksumFailed.at(checksumPart.source)
      }

      return [
        ...inner.attrs(),
        C.RawCode.value(this.sourceString).at(this.source),
        checksumStatus
      ]
    },
    UICCodeInner(this: NonterminalNode, n: NonterminalNode): Attrs {
      return n.attrs()
    },

    // --------------------------- Top-level Vehicle expressions ---------------------------

    UICWagon(this: NonterminalNode, n: NonterminalNode): Attrs {
      return n.attrs()
    },
    UICPassenger(this: NonterminalNode, n: NonterminalNode): Attrs {
      return n.attrs()
    },
    UICTractive(this: NonterminalNode, n: NonterminalNode): Attrs {
      return n.attrs()
    },
    UICSpecial(this: NonterminalNode, n: NonterminalNode): Attrs {
      return n.attrs()
    },

    // --------------------------- Vehicle Type Code expressions ---------------------------

    UICWagonType(this: NonterminalNode, d1: TerminalNode, xs: NonterminalNode, d2: NonterminalNode): Attrs {
      return [
        ...uicWagonTypeCode(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },
    UICPassengerType(this: NonterminalNode, d1: TerminalNode, xs: NonterminalNode, d2: NonterminalNode): Attrs {
      return [
        ...uicPassengerTypeCode(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },
    UICTractiveType(this: NonterminalNode, d1: TerminalNode, xs: NonterminalNode, d2: TerminalNode): Attrs {
      return [
        ...uicTractiveTypeCode(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },
    UICSpecialType(this: NonterminalNode, d1: TerminalNode, xs: NonterminalNode, d2: TerminalNode): Attrs {
      return [
        ...uicTractiveTypeCode(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },

    // --------------------------- Country expression --------------------------------------

    UICCountriesAll(this: NonterminalNode, d1: TerminalNode, d2: TerminalNode): Attrs {
        const code = parseInt(d1.sourceString + d2.sourceString)
        const source = d1.source.coverageWith(d2.source)
        return [
          CountryByCode(code).at(source),
          P.CountryPart.value(this.sourceString).at(this.source)
        ]
    },
  
    // --------------------------- Vehicle Detail expressions ------------------------------

    UICWagonDetail(this: NonterminalNode, d1: NonterminalNode, xs1: NonterminalNode, d2: NonterminalNode, xs2: NonterminalNode, d3: NonterminalNode, xs3: NonterminalNode, d4: NonterminalNode): Attrs {
      //TODO
      return [
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },
    UICPassengerDetail(this: NonterminalNode, d1: NonterminalNode, xs1: NonterminalNode, d2: NonterminalNode, xs2: NonterminalNode, d3: NonterminalNode, xs3: NonterminalNode, d4: NonterminalNode): Attrs {
      //TODO
      return [
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },
    UICTractiveDetail(this: NonterminalNode, d1: TerminalNode, xs1: NonterminalNode, d2: NonterminalNode, xs2: NonterminalNode, d3: NonterminalNode, xs3: NonterminalNode, d4: NonterminalNode, xs4: NonterminalNode, d5: NonterminalNode, xs5: NonterminalNode, d6: NonterminalNode, xs6: NonterminalNode, d7: NonterminalNode): Attrs {
      //TODO
      return [
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },
    UICSpecialDetail(this: NonterminalNode, d1: TerminalNode, xs1: NonterminalNode, d2: NonterminalNode, xs2: NonterminalNode, d3: NonterminalNode, xs3: NonterminalNode, d4: NonterminalNode): Attrs {
      //TODO
      return [
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },

    // --------------------------- General expressions -------------------------------------

    UICSerial(this: NonterminalNode, d1: NonterminalNode, xs1: NonterminalNode, d2: NonterminalNode, xs2: NonterminalNode, d3: NonterminalNode): Attrs {
      const serial = [ d1, d2, d3 ].map(d => d.sourceString).join('')
      const source = d1.source.coverageWith(d2.source, d3.source)
      
      return [
        C.SerialNumber.value(serial).at(source),
        P.SerialPart.value(serial).at(source)
       ]
    },
    UICChecksum(this: NonterminalNode, dash: TerminalNode, digit: NonterminalNode): Attrs {
      return [ P.ChecksumDigitPart.value(digit.sourceString).at(digit.source) ]
    },
    UICKeeper(this: NonterminalNode, arg0: NonterminalNode, arg1: IterationNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: IterationNode, arg5: IterationNode, arg6: IterationNode, arg7: IterationNode): Attrs {
      return [
        P.KeeperPart.value(this.sourceString).at(this.source),
        C.Keeper.value(this.sourceString).at(this.source)
      ]
    },
    
    // --------------------------- Top-level pattern expressions ---------------------------

    CodePattern3(this: NonterminalNode, free1: IterationNode, type: NonterminalNode, free2: IterationNode, country: NonterminalNode, free3: IterationNode, detail: NonterminalNode, checksum: IterationNode, xs: NonterminalNode, free4: IterationNode): Attrs {
      return [ free1, type, free2, country, free3, detail, checksum, free4 ].flatMap(n => n.attrs())
    },
    CodePattern4(this: NonterminalNode, free1: IterationNode, type: NonterminalNode, free2: IterationNode, country: NonterminalNode, free3: IterationNode, detail1: NonterminalNode, detail2: NonterminalNode, checksum: IterationNode, xs: NonterminalNode, free4: IterationNode): Attrs {
      return [ free1, type, free2, country, free3, detail1, detail2, checksum, free4 ].flatMap(n => n.attrs())
    },

    // --------------------------- Other expressions ---------------------------------------

    xt(this: NonterminalNode, xs: NonterminalNode, n: Node): Attrs {
      return n.attrs()
    },
    _iter(this: NonterminalNode, ...children: TerminalNode[]): Attrs {
      return children.flatMap(c => c.attrs())
    }  
  })