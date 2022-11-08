import ohm from 'ohm-js'
import { flattenDeep } from 'lodash-es'
import nomar from 'nomar'

import grammarStr from './uic/grammar.ohm.mjs'
import { Attr, Flag, NodeAttr, Meta } from './attributes.mjs'
import { luhnClean } from './util/luhn.mjs'
import { uicVerify } from './util/rail.mjs'
import { UICCountryCodeMap } from './uic/countries.mjs'
import { uicTypeAttrs } from './uic/types'



console.log(grammar) //TODO
export const grammar = ohm.grammar(grammarStr)

export const semantics = grammar.createSemantics()
  .addOperation('weston', {
    SBBCode_legacyFull(prefix, suffix) {
      return [
        Meta('codeType', 'sbb'),
        Meta('codeVariant', 'legacy'),
        ...prefix.weston(), ...suffix.weston() ]
    },
    SBBCode_mixed(prefix, suffix) {
      return [
        Meta('codeType', 'sbb'),
        Meta('codeVariant', 'hybrid'),
        ...prefix.weston(),
        ...suffix.weston()
      ]
    },

    legacyPrefix(vehicle, traction) {
      return [ ...vehicle.weston(), ...traction.weston() ]
    },
    LegacySuffix(axles, series) {
      return [
        ...axles.children.flatMap(c => c.weston()),
        ...series.children.map(c => c.weston())
      ]
    },
    LegacyAxles(drive, _, total) {
      return [ drive.weston(), ...total.children.map(c => c.weston()) ]
    },
    legacyAxlesDrive(n) {
      return Attr('axlesDrive', n.sourceString, n.source)
    },
    legacyAxlesTotal(n) {
      return Attr('axlesTotal', n.sourceString, n.source)
    },
    legacySeries(n) {
      return Attr('series', nomar(n.sourceString), n.source)
    },
    vehicleCode(n) {
      return flattenDeep(n.weston())
    },

    ///////////////////////////////
    // Legacy locamotive codes
    ///////////////////////////////

    locomotiveCode(n) {
      return n.children.map(c => c.weston())
    },

    locomotiveToken_A(n) {
      return [
        Attr('trackGauge', 'standard', n.source),
        Attr('vmax', '>80 km/h', n.source) ]
    },
    locomotiveToken_B(n) {
      return [
        Attr('trackGauge', 'standard', n.source),
        Attr('vmax', '70-80 km/h', n.source) ]

    },
    locomotiveToken_C(n) {
      return [
        Attr('trackGauge', 'standard', n.source),
        Attr('vmax', '60-65 km/h', n.source) ]

    },
    locomotiveToken_D(n) {
      return [
        Attr('trackGauge', 'standard', n.source),
        Attr('vmax', '45-55 km/h', n.source) ]

    },
    locomotiveToken_E(n) {
      return [ Flag('shunter', n.source) ]
    },
    locomotiveToken_f(n) {
      // only used for locomotives pre 1920
      return [ Flag('electric', n.source) ]
    },
    locomotiveToken_G(n) {
      return [ Attr('trackGuage', 'narrow', n.source) ]
    },
    locomotiveToken_H(n) {
      return [ Flag('gearDrive', n.source) ]
    },
    locomotiveToken_R(n) {
      return [ Flag('fastCornering', n.source) ]
    },
    locomotiveToken_T(n) {
      return [ Flag('tractor', n.source) ]
    },


    ///////////////////////////////
    // Legacy traction codes
    ///////////////////////////////
    tractionCode(n) {
      let codes = n.children.map(c => c.weston())
      return codes.length > 0 ? codes : [ Flag('steam', n.source) ]
    },
    tractionToken(n) {
      let token = n.child(0)
      let code = token.weston()
      let source = token.source
      let tractionMap = {
        'a': Flag('battery', source),
        'e': Flag('electric', source),
        'f': Flag('radioControlled', source),
        'H': Flag('gearDrive', source),
        'm': Flag('fuel', source)
      }
      return tractionMap[code]
    },

    ///////////////////////////////
    // Legacy railcar codes
    ///////////////////////////////

    railcarCode(n) {
      return flattenDeep(n.children.map(c => c.weston()))
    },

    railcarToken_AB_A(n) {  // Railcar with first-class compartment or saloon compartment
      return [ Flag('firstClass', n.source) ]
    },
    railcarToken_AB_B(n) {  // Railcar with second class compartment
      return [ Flag('secondClass', n.source) ]
    },

    railcarToken_Cornering(n) { // Railcars with increased cornering speed and v max at least 110 km/h (only for standard gauge)
      return [
        Flag('fastCornering', n.source),
        Attr('vmax', '>110 km/h', n.source) ]
    },
    railcarToken_Restaurant(n) {  // Restaurant, buffet (after A or B)
      return [ Flag('restaurant', n.source) ]
    },

    railcarToken_General_C(n) {  // Railcar with third class compartment (before 1956)
      return [ Flag('thirdClass', n.source) ]
    },
    railcarToken_General_D(n) {  // Railcar with luggage compartment (since 1962)
      return [ Flag('luggage', n.source) ]
    },
    railcarToken_General_f(n) {  // Railcar with luggage compartment (until 1961)
      return [ Flag('luggage', n.source) ]
    },
    railcarToken_General_K(n) {  // Closed railcar (all Ke were later redrawn to Fe)
      return [ Flag('railcarClosed', n.source) ]
    },
    railcarToken_General_L(n) {  // Initially used to designate light railcars ( red arrows ), e.g. B. CLe 2/4
      return [ Flag('lightRailcar', n.source) ]
    },
    railcarToken_General_O(n) {  // Gondola (Ohe 1/2 31 of the Pilatusbahn)
      return [ Flag('gondola', n.source) ]
    },
    railcarToken_General_S(n) {  // Special compartment
      return [ Flag('specialRailcar', n.source) ]
    },
    railcarToken_General_S(n) {  // Self-propelled container wagon (CargoSprinter)
      return [ Flag('cargoSprinter', n.source) ]
    },
    railcarToken_General_X(n) {  // Service vehicle
      return [ Flag('serviceVehicle', n.source) ]
    },
    railcarToken_General_XT(n) {  // Self-driving company car
      return [ Flag('selfDrivingCompanyRailcar', n.source) ]
    },
    railcarToken_General_Z(n) {  // Railcar with mail compartment
      return [ Flag('mail', n.source) ]
    },

    ///////////////////////////////
    // Modern suffix codes
    ///////////////////////////////

    modernSuffix(code1, x1, code2, x2, x3, x4, ext) {
      // modernSuffixCode1 (space* modernSuffixCode2 (space* "-" space* modernSuffixCodeExt)?)?
      //return [ ...code1.children.map(c => c.weston()) ]
      return [ ...code1.weston() ]
    },
    modernSuffixCode1(a, b, c) {
      return [n.sourceString]
    },
    modernSuffixCode2(d, e, f) {
      return [n.sourceString]
    },
    modernSuffixCodeExt(n) {
      return [n.sourceString]
    },

    ///////////////////////////////
    // UIC
    ///////////////////////////////

    UICLong(type, country, regional, owner) {
      // Verify checksum digit
      let raw = luhnClean(type.sourceString + country.sourceString + regional.sourceString)
      let valid = raw.length < 12 ? 'absent' : (uicVerify(raw) ? 'pass' : 'fail')

      return [
        Meta("codeType", "uic"),
        Meta("uicChecksum", valid),
        ...type.weston(),
        country.weston()
      ]
    },

    UICType(type) {
      return uicTypeAttrs(type)
    },

    UICCountry(d1, spaces, d2) {
        let code = d1.sourceString + d2.sourceString
        let source = d1.source.coverageWith(d2.source)
        return Attr('country', UICCountryCodeMap[code], source)
    },

    ///////////////////////////////
    // Generic actions
    ///////////////////////////////

    _iter(...children) {
      return children.map(c => c.weston())
    },
    _terminal() {
      return this.sourceString;
    }
})
