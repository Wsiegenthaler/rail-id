import * as C from '../attrs/common'
import * as V from '../attrs/vehicles/common'
import * as A from '../attrs/vehicles/type-code'
import * as T from '../attrs/vehicles/tractive'
import { GaugesByDist } from '../attrs/gauge'
import { applyDigitRules, Rule } from '.'


// ---- Other Notes ------------------------------------

const MaintenanceWagonNote     = V.OtherNotes.value('This code is generally used to describe **Maintenance related vehicles**')
const MiscWagonNote            = V.OtherNotes.value('This code is generally used to describe **Miscellaneous vehicles**')
const MiscPassengerVehicleNote = V.OtherNotes.value('This code is generally used to describe **Miscellaneous passenger vehicles**')
const TEN_COTIF_WagonNote      = V.OtherNotes.value('This code is generally used to describe vehicles with **TEN** and/or **COTIF** compliance')
const PPV_PPW_WagonNote        = V.OtherNotes.value('This code is generally used to describe vehicles with **PPV** and/or **PPW** compliance')
const SpecialNumberedWagonNote = V.OtherNotes.value('Wagon with special numbering for technical characteristics not placed in service inside EU')

// ---- Common (first digit only) ------------------------------------
const CommonTypeRulesD1: Rule[] = [
  // Vehicle type
  { pattern: /[012348]/, defs: [ A.WagonVehicle ] },
  { pattern: /[567]/, defs: [ A.HauledPassenger ] },
  { pattern: /9/, defs: [ A.TractiveVehicle ] }
]

// ---- Wagons (first digit only) ------------------------------------
const WagonTypeRulesD1: Rule[] = [
  // Suspension (axles or bogies)
  { pattern: /[024]/, defs: [ A.Axles ] },
  { pattern: /[138]/, defs: [ A.Bogies ] },

  // Traffic (domestic/international)
  { pattern: /[012348]/, defs: [ A.DomesticInternational ] }
]

// ---- Wagons (digit 1 and 2) ---------------------------------------
const UICWagonTypeRulesD12: Rule[] = [

  // Track gauge type (fixed or variable)
  { pattern: /[012348][1357]/, defs: [ A.FixedGauge ] },
  { pattern: /[012348][2468]/, defs: [ A.VariableGauge ] },
  { pattern: /[01]9/, defs: [ A.VariableGauge ] },
  { pattern: /[23]9/, defs: [ A.FixedGauge ] },

  // General description
  { pattern: /[48]0/, defs: [ MaintenanceWagonNote ] },
  { pattern: /[01][12]/, defs: [ TEN_COTIF_WagonNote ] },
  { pattern: /[23][1-8]/, defs: [ TEN_COTIF_WagonNote ] },
  { pattern: /[48][1-8]/, defs: [ MiscWagonNote ] },
  { pattern: /[0-3]9/, defs: [ PPV_PPW_WagonNote ] },
  { pattern: /[48][9]/, defs: [ SpecialNumberedWagonNote ] },

  // Warnings for blocks designated "Not to be used"
  {
    pattern: /[01][3-8]/,
    defs: [
      C.ParseWarnings.value({
        type: 'unexpected-value',
        subType: 'uic-type-code',
        msg: 'Wagons with starting digits 0 or 1 followed by 3-8 are not to be used, but are excepted for wagons in Category I (temperature-controlled wagons) and not to be used for new vehicles placed in service'
      })
    ]
  },
  {
    pattern: /[0-3]0/,
    defs: [
      C.ParseWarnings.value({
        type: 'unexpected-value',
        subType: 'uic-type-code',
        msg: 'Wagons with starting digits 0-3 followed by 0 are not to be used according to Part 6 of the \'Operation and Traffic Management’ UIC manual (2011)'
      })
    ]
  }
]

// ---- Passenger stock ----------------------------------------------
const UICPassengerTypeRulesD12: Rule[] = [
  // Traffic
  { pattern: /[567]0/, defs: [ A.Domestic ] },
  { pattern: /[567]5/, defs: [ A.DomesticInternational ] },

  // Track gauge type (fixed or variable)
  { pattern: /[56][17]/, defs: [ A.FixedGauge ] },
  { pattern: /73/, defs: [ A.FixedGauge ] },
  { pattern: /[56][2489]/, defs: [ A.VariableGauge ] },

  // Air conditioning
  { pattern: /7[03]/,  defs: [ A.AirConditioned.value('Yes') ] },
  { pattern: /6[124]/, defs: [ A.AirConditioned.value('Yes') ] },
  { pattern: /5[124]/, defs: [ A.AirConditioned.value('No') ] },
  
  // Historic vehicles
  { pattern: /55/, defs: [ A.HistoricVehicle ] },
  
  // Car carrying wagons
  { pattern: /65/, defs: [ A.CarCarrier ] },
  
  // Miscellaneous vehicles
  { pattern: /[48][1-8]/, defs: [ MiscPassengerVehicleNote ] },

  // General description
  { pattern: /[567]6/, defs: [ TEN_COTIF_WagonNote ] },
  { pattern: /[567][789]/, defs: [ PPV_PPW_WagonNote ] },
  { pattern: /[567][1234]/, defs: [ TEN_COTIF_WagonNote, PPV_PPW_WagonNote ] },
 
  // Service vehicles
  { pattern: /6[03]/, defs: [ A.ServiceVehicle ] },
  
  // Pressure-tight vehicles
  { pattern: /7[03]/, defs: [ A.PressurizedVehicle ] },
 
  // Gauge support
  { pattern: /[56][289]/, defs: [ A.VariableGauge, ...GaugesByDist(1435, 1520) ] },
  { pattern: /[56]4/, defs: [ A.VariableGauge, ...GaugesByDist(1435, 1668) ] },

  // Suspension
  { pattern: /[56]8/, defs: [ A.Bogies ] },
  { pattern: /[56]9/, defs: [ A.Axles ] },

  // "Not to be used" blocks
  {
    pattern: /53/,
    defs: [ C.ParseWarnings.value({
      type: 'unexpected-value',
      subType: 'uic-type-code',
      msg: 'Passenger vehicles starting with digits \'53\' are not to be used according to Part 7 of the \'Operation and Traffic Management’ UIC manual (2011)'
    }) ]
  },
  {
    pattern: /7[1246789]/,
    defs: [ C.ParseWarnings.value({
      type: 'unexpected-value',
      subType: 'uic-type-code',
      msg: 'Passenger vehicles starting with digit 7 followed by 1, 2, 4, 6, 7, 8, or 9 are not to be used according to Part 7 of the \'Operation and Traffic Management’ UIC manual (2011)'
    }) ]
  },
  {
    pattern: /[56]6/,
    defs: [ C.ParseWarnings.value({
      type: 'unexpected-value',
      subType: 'uic-type-code',
      msg: 'Passenger vehicles starting with digits \'56\' or \'66\' are not to be used, but are excepted for coaches with fixed gauge (\'56\') and adjustable gauge (\'66\') already in service and not to be used for new vehicles'
    }) ]
  }
]

// ---- Tractive stock -----------------------------------------------
const UICTractiveTypeRulesD12: Rule[] = [
  { pattern: /90/, defs: [ T.MiscellaneousVehicle ] },
  { pattern: /91/, defs: [ T.ElectricLocomotive,            T.Traction.value('Electric') ] },
  { pattern: /92/, defs: [ T.DieselLocomotive,              T.Traction.value('Diesel') ] },
  { pattern: /93/, defs: [ T.HighSpeedElectricMultiUnitSet, T.Traction.value('Electric') ] },
  { pattern: /94/, defs: [ T.LowSpeedElectricMultiUnitSet,  T.Traction.value('Electric') ] },
  { pattern: /95/, defs: [ T.DieselMultiUnitSet,            T.Traction.value('Diesel') ] },
  { pattern: /96/, defs: [ T.SpecialisedTrailer ] },
  { pattern: /97/, defs: [ T.ElectricShunter,               T.Traction.value('Electric') ] },
  { pattern: /98/, defs: [ T.DieselShunter,                 T.Traction.value('Diesel') ] },
  { pattern: /99/, defs: [ T.SpecialVehicle ] }
]

// Returns vehicle attrs for the given Ohm parse node of wagon unit type codes
export const applyWagonTypeRulesD12 = applyDigitRules([ ...CommonTypeRulesD1, ...WagonTypeRulesD1 ], UICWagonTypeRulesD12)

// Returns vehicle attrs for the given Ohm parse node of hauled-passenger unit type codes
export const applyPassengerTypeRulesD12 = applyDigitRules(CommonTypeRulesD1, UICPassengerTypeRulesD12)

// Returns vehicle attrs for the given Ohm parse node of tractive unit type codes
export const applyTractiveTypeRulesD12 = applyDigitRules(CommonTypeRulesD1, UICTractiveTypeRulesD12)
