import { Attr, Flag, NodeAttr, Meta } from '../attributes.mjs'


// List of regex patterns and corresponding vehicle attributes
export const UICTypeRules = [
  { pattern: /[012348]./, attrs: [ Attr('vehicleType', 'wagon') ] },
  { pattern: /[567]./, attrs: [ Attr('vehicleType', 'passenger') ] },
  { pattern: /9./, attrs: [ Attr('vehicleType', 'locomotive') ] },

  // Wagons
  // Passenger cars
  // Locomotive
  { pattern: /90/, exact: true, attrs: [ Flag('miscellaneous') ] },
  { pattern: /91/, exact: true, attrs: [ Flag('electric') ] },
  { pattern: /92/, exact: true, attrs: [ Flag('diesel') ] },
  { pattern: /93/, exact: true, attrs: [ Flag('electric'), Flag('multipleUnitSet'), Attr('vmax', 'high speed') ] },
  { pattern: /94/, exact: true, attrs: [ Flag('electric'), Attr('vmax', 'not high speed') ] },
  { pattern: /95/, exact: true, attrs: [ Flag('diesel'), Flag('multipleUnitSet') ] },
  { pattern: /96/, exact: true, attrs: [ Flag('specialRailcar') ] },
  { pattern: /97/, exact: true, attrs: [ Flag('electric'), Flag('shunter') ] },
  { pattern: /98/, exact: true, attrs: [ Flag('diesel'), Flag('shunter') ] },
  { pattern: /99/, exact: true, attrs: [ Flag('selfDrivingCompanyRailcar') ] },
]

// Returns an array of vehicle attributes for the given UIC type code Ohm parse node
export const uicTypeAttrs = typeNode => {
    let { source, sourceString } = typeNode
    let code = sourceString.replaceAll(/[^0-9]/g, '')
    return UICTypeRules
      .filter(r => r.pattern.test(code))
      .flatMap(r => r.attrs)
      .map(a => ({ ...a, source }))
}