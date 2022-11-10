import ohm, { TerminalNode } from 'ohm-js'
import { find, isObject } from 'lodash-es'
import { IterationNode, Node, NonterminalNode } from 'ohm-js'

import { luhnClean } from './util/luhn'
import { uicVerify } from './util/luhn-uic'
import { uicPassengerTypeCode, uicTractiveTypeCode, uicWagonTypeCode } from './rules/types'

import { Attr, Attrs } from './attributes/builders'
import { CountryByCode } from './attributes/countries'
import * as C from './attributes/vehicles/common-fields'
import * as P from './attributes/code-parts'

import grammarStr from './uic/grammar.ohm'
import { uicSpecialTractiveD6, uicSpecialTractiveD78 } from './rules/tractive-special'
import keeperMap from './uic/keepers'
import { uicHauledPassengerD78 } from './rules/hauled-passenger'


export const grammar = ohm.grammar(grammarStr)

export const semantics = grammar.createSemantics()
  .addOperation('attrs', {

    // --------------------------- Root expression -----------------------------------------

    UICCode(this: NonterminalNode, inner: NonterminalNode): Attrs {
      const childAttrs = inner.attrs()

      // Checksum validation
      let checksumStatus = C.ChecksumAbsent.absent()
      const checksumPart = P.ChecksumDigitPart.find(childAttrs)
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

    UICWagonDetail(this: NonterminalNode, d5: NonterminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode): Attrs {
      //TODO
      return [
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },
    UICPassengerDetail(this: NonterminalNode, d5: NonterminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode): Attrs {
      //TODO digits 5 and 6
      return [
        ...uicHauledPassengerD78(d7, d8),
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },
    UICTractiveDetail(this: NonterminalNode, d5: TerminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode, xs4: NonterminalNode, d9: NonterminalNode, xs5: NonterminalNode, d10: NonterminalNode, xs6: NonterminalNode, d11: NonterminalNode): Attrs {
      // This block is defined by the Member States, eventually by bilateral or multilateral agreement
      return [ P.VehicleDetailPart.value(this.sourceString).at(this.source) ]
    },
    UICSpecialDetail(this: NonterminalNode, d5: TerminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode): Attrs {
      return [
        ...uicSpecialTractiveD6(d6),
        ...uicSpecialTractiveD78(d7, d8),
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
    UICKeeper(this: NonterminalNode, p1_l1: NonterminalNode, p1_l2: IterationNode, dash: TerminalNode, p2_l1: NonterminalNode, p2_l2: IterationNode, p2_l3: IterationNode, p2_l4: IterationNode, p2_l5: IterationNode): Attrs {
      // Lookup keeper def and generate attribute
      const vkm = [ p2_l1, p2_l2, p2_l3, p2_l4, p2_l5 ].map(l => l.sourceString).join('')
      const vkmSource = p2_l1.source.coverageWith(...[ p2_l2, p2_l3, p2_l4, p2_l5 ].map(l => l.source))
      const keeperAttr = [ keeperMap[vkm] ].filter(isObject).map(d => C.Keeper.value(d).at(vkmSource) )

      // Log warning if vkm doesn't exist in our definitions
      const keeperWarning = keeperAttr.length === 0 ? [ C.ParseWarnings.value(`Vehicle Keeper Marking '${this.sourceString}' doesn't appear to be a known value.`).at(this.source) ] : []

      return [
        ...keeperAttr,
        ...keeperWarning,
        P.KeeperPart.value(this.sourceString).at(this.source)
      ]
    },
    UICDesignation_RIV(tis: NonterminalNode, n: TerminalNode): Attrs {
      return [ C.RIVVehicle.at(n.source) ]
    },
    UICDesignation_TEN(tis: NonterminalNode, n: TerminalNode): Attrs {
      return [ C.TENVehicle.at(n.source) ]
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