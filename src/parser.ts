import { TerminalNode, IterationNode, Node, NonterminalNode } from 'ohm-js'

import grammar from './grammars/uic-grammar.ohm-bundle'

import { luhnClean } from './util/luhn'
import { uicVerify } from './util/luhn-uic'

import { Attrs } from './attrs'
import * as C from './attrs/common'
import * as V from './attrs/vehicles/common'
import * as P from './attrs/code-parts'

import { CountryByCode, CountryByShortCode } from './attrs/countries'
import { KeeperByCode, KeeperField } from './attrs/keepers'

import { specialTractiveD6, specialTractiveD78 } from './rules/tractive-special'
import { applyPassengerTypeRulesD12, applyTractiveTypeRulesD12, applyWagonTypeRulesD12 } from './rules/type-code'
import { applyHauledPassengerD56, applyHauledPassengerD78 } from './rules/hauled-passenger'
import { UICCountryByShort } from './defs/countries'
import { applyHauledPassenger_Serial, applyHauledPassenger_Index } from './rules/letters/hauled-passenger'


export { grammar }

export const semantics = grammar.createSemantics()
  .addOperation('attrs', {

    // --------------------------- Root expression -----------------------------------------

    UICCode(this: NonterminalNode, inner: NonterminalNode): Attrs {
      const childAttrs = inner.attrs()

      // Checksum validation
      let checksumStatus = C.ChecksumStatus.value('Absent').absent()
      let checksumWarning = [ C.ParseWarnings.value(
        {
          type: 'checksum',
          subType: 'absent',
          msg: `This code does not include a checksum digit and so cannot be verified`
        }).absent()
      ]
      const checksumPart = P.ChecksumDigitPart.find(childAttrs)
      if (checksumPart) {
        const digits = luhnClean(this.sourceString)
        const checksumSource = checksumPart.source
        const valid = uicVerify(digits)
        checksumStatus = valid ?
          C.ChecksumStatus.value('Passed').atSource(checksumSource) :
          C.ChecksumStatus.value('Failed').atSource(checksumSource)

        // Parse warning on failed/absent checksum
        checksumWarning = valid ? [] : [
          C.ParseWarnings.value({
            type: 'checksum',
            subType: 'failed',
            msg: `This code does not match checksum digit "${checksumPart.def.value}"`
          }).atSource(checksumSource)
        ]
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
        ...specialTractiveD6(d6),
        ...specialTractiveD78(d7, d8),
        P.VehicleDetailPart.value(this.sourceString).at(this.source)
      ]
    },

    // --------------------------- Keeper expressions --------------------------------------

    UICKeeperPrefix(this: NonterminalNode, d1: NonterminalNode, d2: IterationNode, dash: TerminalNode): Attrs {
      const country = [ d1, d2 ].map(l => l.sourceString).join('')
      const countrySource = d1.source.coverageWith(d2.source)

      return [ P.KeeperCountryPart.value(country).at(countrySource) ]
    },
    UICKeeperSuffix(this: NonterminalNode, d1: NonterminalNode, d2: IterationNode, d3: IterationNode, d4: IterationNode, d5: IterationNode): Attrs {
      return [
        KeeperByCode(this.sourceString).at(this.source),
        P.KeeperCompanyPart.value(this.sourceString).at(this.source)
      ]
    },
    UICKeeper(this: NonterminalNode, prefix: IterationNode, suffix: NonterminalNode): Attrs {
      const prefixAttrs = prefix.attrs()
      const suffixAttrs = suffix.attrs()

      // Cross check prefix (i.e. country part) with expected value given keeper def
      const countryPart = P.KeeperCountryPart.find(prefixAttrs)
      const keeperDefAttr = KeeperField.find(suffixAttrs)
      let countryWarning = []
      if (countryPart && keeperDefAttr && countryPart.def.value !== keeperDefAttr.def.value.country) {
        const expectedCountry = UICCountryByShort(keeperDefAttr.def.value.country)
        if (expectedCountry) {
          /* Issue warning that the country def doesn't match the country portion of the KVM */
          const foundShort = countryPart.def.value
          const company = keeperDefAttr.def.value.company
          countryWarning = [ C.ParseWarnings
            .value({
              type: 'conflict',
              subType: 'vkm',
              msg: `Country portion of the Vehicle Keeper Marking is "${foundShort}" but "${company}" is located in ${expectedCountry.long} (${expectedCountry.short})`
            })
            .atSource(countryPart.source, keeperDefAttr.source)
          ]
        }
      }

      // Add country attribute (possibly redundant)
      const countryShort = keeperDefAttr ? keeperDefAttr.def.value.country : (countryPart ? countryPart.def.value : undefined)
      const countryShortSource = keeperDefAttr ? keeperDefAttr.source : (countryPart ? countryPart.source : undefined)
      const countryAttr = [ CountryByShortCode(countryShort) ].filter(a => a).map(a => a.atSource(countryShortSource))

      return [
        ...prefixAttrs,
        ...suffixAttrs,
        ...countryAttr,
        ...countryWarning,
        P.KeeperMarkingPart.value(this.sourceString).at(this.source)
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

    // --------------------------- TODO ----------------------------------------------------

    uicWagonLetters(this: NonterminalNode, arg0: NonterminalNode): Attrs {
      return [] //TODO
    },
    
    // --------------------------- Hauled-Passenger Letters --------------------------------

    uicPassengerLetters(this: NonterminalNode, serialTokens: NonterminalNode, indexTokens: NonterminalNode): Attrs {
      return [ ...serialTokens.attrs(), ...indexTokens.attrs() ]
    },
    
    uicPassengerLetters_Serial(this: NonterminalNode, token: NonterminalNode): Attrs {
      return [ ...applyHauledPassenger_Serial(token) ]
    },
    
    uicPassengerLetters_Index(this: NonterminalNode, token: NonterminalNode): Attrs {
      return [ ...applyHauledPassenger_Index(token) ]
    },

    // --------------------------- Other expressions ---------------------------------------

    xt(this: NonterminalNode, xs: NonterminalNode, n: Node): Attrs {
      return n.attrs()
    },
    tD(this: NonterminalNode, xs: NonterminalNode, n: Node): Attrs {
      return xs.attrs()
    },
    _iter(this: NonterminalNode, ...children: TerminalNode[]): Attrs {
      return children.flatMap(c => c.attrs())
    }  
  })