import { Attr, Flag, NodeAttr, Meta } from '../attributes.mjs'
import { GaugeByDist, StandardGauge } from '../track-guage.mjs'

// List of regex patterns and corresponding vehicle attributes
export const UICTypeRules = [
  { pattern: /[012348]./, attrs: [ Attr('vehicleType', 'wagon') ] },
  { pattern: /[567]./, attrs: [ Attr('vehicleType', 'passenger') ] },
  { pattern: /9./, attrs: [ Attr('vehicleType', 'locomotive') ] },

  // ---- Wagons -------------------------------------------------------

  // Wagon suspension (axles or bogies)
  { pattern: /[024]./, attrs: [ Attr('suspension', 'axles') ] },
  { pattern: /[138]./, attrs: [ Attr('suspension', 'bogies') ] },

  // Wagon - Track gauge type (fixed or variable)
  { pattern: /[012348][1357]/, attrs: [ Attr('gaugeType', 'fixed') ] },
  { pattern: /[012348][2468]/, attrs: [ Attr('gaugeType', 'variable') ] },
  { pattern: /[01]9/, attrs: [ Attr('gaugeType', 'variable') ] },
  { pattern: /[23]9/, attrs: [ Attr('gaugeType', 'fixed') ] },

  // Wagon - General description
  { pattern: /[48]0/, attrs: [ Attr('desc', 'Maintenance related wagon') ] },
  { pattern: /[01][12]/, attrs: [ Attr('desc', 'TEN and/or COTIF wagon') ] },
  { pattern: /[23][1-8]/, attrs: [ Attr('desc', 'TEN and/or COTIF wagon') ] },
  { pattern: /[48][1-8]/, attrs: [ Attr('desc', 'Miscellaneous wagon') ] },
  { pattern: /[0-3]9/, attrs: [ Attr('desc', 'PPV/PPW wagon') ] },
  { pattern: /[48][9]/, attrs: [ Attr('desc', 'Wagon with special numbering for technical characteristics not placed in service inside EU') ] },

  // Wagon - Traffic
  { pattern: /[012348]./, attrs: [ Attr('traffic', 'Domestic or international by special agreement') ] },

  // ---- Passenger stock ----------------------------------------------
  
  // Passenger - Traffic
  { pattern: /[567]0/, attrs: [ Attr('traffic', 'Domestic') ] },
  { pattern: /[567]5/, attrs: [ Attr('traffic', 'Domestic or international by special agreement') ] },

  // Passenger - Track gauge type (fixed or variable)
  { pattern: /[56][17]/, attrs: [ Attr('gaugeType', 'fixed') ] },
  { pattern: /73/, attrs: [ Attr('gaugeType', 'fixed') ] },
  { pattern: /[56][2489]/, attrs: [ Attr('gaugeType', 'variable') ] },

  // Passenger - Air conditioning
  { pattern: /7[03]/, attrs: [ Flag('airConditioned') ] },
  { pattern: /6[124]/, attrs: [ Flag('airConditioned') ] },
  { pattern: /5[124]/, attrs: [ Attr('airConditioned', false) ] },
  
  // Passenger - Historic vehicles
  { pattern: /55/, attrs: [ Flag('historicVehicle') ] },
  
  // Passenger - Car carrying wagons
  { pattern: /65/, attrs: [ Flag('carCarrying') ] },
  
  // Passenger - Miscellaneous vehicles
  { pattern: /[48][1-8]/, attrs: [ Attr('desc', 'Miscellaneous passenger vehicle') ] },

  // Passenger - General description
  { pattern: /[567]6/, attrs: [ Attr('desc', 'TEN and/or COTIF wagon') ] },
  { pattern: /[567][789]/, attrs: [ Attr('desc', 'PPV/PPW wagon') ] },
  { pattern: /[567][1234]/, attrs: [ Attr('desc', 'TEN and/or COTIF and/or PPV/PPW') ] },
 
  // Passenger - Service vehicles
  { pattern: /6[03]/, attrs: [ Flag('serviceVehicle') ] },
  
  // Passenger - Pressure-tight vehicles
  { pattern: /7[03]/, attrs: [ Flag('pressurized') ] },
 
  // Passenger - Gauge support
  { pattern: /[56][289]/, attrs: [ Attr('trackGaugeSupport', [ GaugeByDist(1435), GaugeByDist(1520) ]) ] },
  { pattern: /[56]4/, attrs: [ Attr('trackGaugeSupport', [ GaugeByDist(1435), GaugeByDist(1668) ]) ] },

  // Passenger - Suspension
  { pattern: /[56]8/, attrs: [ Attr('suspension', 'bogies') ] },
  { pattern: /[56]9/, attrs: [ Attr('suspension', 'axles') ] },

  // ---- Tractive stock -----------------------------------------------

  { pattern: /90/, attrs: [ Flag('miscellaneous') ] },
  { pattern: /91/, attrs: [ Flag('electric') ] },
  { pattern: /92/, attrs: [ Flag('diesel') ] },
  { pattern: /93/, attrs: [ Flag('electric'), Flag('multipleUnitSet'), Attr('vmax', 'high speed') ] },
  { pattern: /94/, attrs: [ Flag('electric'), Attr('vmax', 'not high speed') ] },
  { pattern: /95/, attrs: [ Flag('diesel'), Flag('multipleUnitSet') ] },
  { pattern: /96/, attrs: [ Flag('specialRailcar') ] },
  { pattern: /97/, attrs: [ Flag('electric'), Flag('shunter') ] },
  { pattern: /98/, attrs: [ Flag('diesel'), Flag('shunter') ] },
  { pattern: /99/, attrs: [ Flag('selfDrivingCompanyRailcar') ] },
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