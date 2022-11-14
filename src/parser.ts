import { TerminalNode, IterationNode, Node, NonterminalNode, Interval } from 'ohm-js'

import grammar from './grammars/uic-grammar.ohm-bundle'

import { luhnClean } from './util/luhn'
import { uicVerify } from './util/luhn-uic'

import { Attrs, Attr } from './attrs'
import * as C from './attrs/common'
import * as V from './attrs/vehicles/common'
import * as P from './attrs/code-parts'

import { CountryByCode } from './attrs/countries'
import { KeeperByCode } from './attrs/keepers'

import { specialTractiveD56, specialTractiveD78 } from './rules/tractive-special'
import { applyPassengerTypeRulesD12, applyTractiveTypeRulesD12, applyWagonTypeRulesD12 } from './rules/type-code'
import { applyHauledPassengerD56, applyHauledPassengerD78 } from './rules/hauled-passenger'


export { grammar }

export const semantics = grammar.createSemantics()
  .addOperation('attrs', {

    // --------------------------- Root expression -----------------------------------------

    UICCode(this: NonterminalNode, inner: NonterminalNode): Attrs {
      const childAttrs = inner.attrs()

      // Checksum validation
      let checksumStatus = C.ChecksumStatus.value('absent').absent()
      let checksumWarning = [ C.ParseWarnings.value(`This code does not include a checksum digit and so cannot be verified`).absent() ]
      const checksumPart = P.ChecksumDigitPart.find(childAttrs)
      if (checksumPart) {
        const digits = luhnClean(this.sourceString)
        const checksumSource = checksumPart.source as Interval
        const valid = uicVerify(digits)
        checksumStatus = valid ?
          C.ChecksumStatus.value('passed').at(checksumSource) :
          C.ChecksumStatus.value('failed').at(checksumSource)

        // Parse warning on failed/absent checksum
        checksumWarning = valid ? [] : [ C.ParseWarnings.value(`This code does not match checksum digit "${checksumPart.def.value}"`).at(checksumSource) ]
      }

      return [
        C.RawCode.value(this.sourceString).at(this.source),
        C.CodeType.value('UIC').absent(),
        checksumStatus,
        ...checksumWarning,
        ...inner.attrs(),
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
        ...applyWagonTypeRulesD12(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },
    UICPassengerType(this: NonterminalNode, d1: TerminalNode, xs: NonterminalNode, d2: NonterminalNode): Attrs {
      return [
        ...applyPassengerTypeRulesD12(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },
    UICTractiveType(this: NonterminalNode, d1: TerminalNode, xs: NonterminalNode, d2: TerminalNode): Attrs {
      return [
        ...applyTractiveTypeRulesD12(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },
    UICSpecialType(this: NonterminalNode, d1: TerminalNode, xs: NonterminalNode, d2: TerminalNode): Attrs {
      return [
        ...applyTractiveTypeRulesD12(d1, d2),
        P.TypePart.value(this.sourceString).at(this.source)
      ]
    },

    // --------------------------- Country expression --------------------------------------

    UICCountriesAny(this: NonterminalNode, d1: TerminalNode, d2: TerminalNode): Attrs {
        const code = parseInt(d1.sourceString + d2.sourceString)
        const source = d1.source.coverageWith(d2.source)
        return [
          CountryByCode(code).at(source),
          P.CountryPart.value(this.sourceString).at(this.source)
        ]
    },
  
    // --------------------------- Vehicle Detail expressions ------------------------------

    UICWagonDetail(this: NonterminalNode, d5: NonterminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode): Attrs {
      //TODO 'Part 9' isn't included in the doc. find it.
      return [
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },
    UICPassengerDetail(this: NonterminalNode, d5: NonterminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode): Attrs {
      return [
        ...applyHauledPassengerD56(d5, d6),
        ...applyHauledPassengerD78(d7, d8),
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },
    UICTractiveDetail(this: NonterminalNode, d5: TerminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode, xs4: NonterminalNode, d9: NonterminalNode, xs5: NonterminalNode, d10: NonterminalNode, xs6: NonterminalNode, d11: NonterminalNode): Attrs {
      return [
        P.VehicleDetailPart.value(this.sourceString)
          .notes('This block is defined by the Member States, eventually by bilateral or multilateral agreement')
          .at(this.source)
        ]
    },
    UICSpecialDetail(this: NonterminalNode, d5: TerminalNode, xs1: NonterminalNode, d6: NonterminalNode, xs2: NonterminalNode, d7: NonterminalNode, xs3: NonterminalNode, d8: NonterminalNode): Attrs {
      return [
        ...specialTractiveD56(d5, d6),
        ...specialTractiveD78(d7, d8),
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },

    // --------------------------- General expressions -------------------------------------

    UICSerial(this: NonterminalNode, d1: NonterminalNode, d2: NonterminalNode, d3: NonterminalNode): Attrs {
      const serial = [ d1, d2, d3 ].map(d => d.sourceString).join('')
      const source = d1.source.coverageWith(d2.source, d3.source)
      
      return [
        V.SerialNumber.value(serial).at(source),
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

      return [
        KeeperByCode(vkm).at(vkmSource),
        P.KeeperPart.value(this.sourceString).at(this.source)
      ]
    },
    UICDesignation_RIV(this: NonterminalNode, n: TerminalNode): Attrs {
      return [ V.RIVVehicle.at(n.source) ]
    },
    UICDesignation_TEN(this: NonterminalNode, n: TerminalNode): Attrs {
      return [ V.TENVehicle.at(n.source) ]
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