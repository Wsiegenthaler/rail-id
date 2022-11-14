import * as C from '../attrs/common'
import * as V from '../attrs/vehicles/common'
import * as A from '../attrs/vehicles/type-code'
import * as T from '../attrs/vehicles/tractive'
import { GaugesByDist } from '../attrs/gauge'
import { applyDigitRules, Rule } from '.'


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
  { pattern: /[48]0/, defs: [ V.MaintenanceWagonNote ] },
  { pattern: /[01][12]/, defs: [ V.TEN_COTIF_WagonNote ] },
  { pattern: /[23][1-8]/, defs: [ V.TEN_COTIF_WagonNote ] },
  { pattern: /[48][1-8]/, defs: [ V.MiscWagonNote ] },
  { pattern: /[0-3]9/, defs: [ V.PPV_PPW_WagonNote ] },
  { pattern: /[48][9]/, defs: [ V.SpecialNumberedWagonNote ] },

  // Warnings for blocks designated "Not to be used"
  {
    pattern: /[01][3-8]/,
    defs: [ C.ParseWarnings.value('Wagons with starting digits 0 or 1 followed by 3-8 are not to be used, but are excepted for wagons in category I (temperature-controlled wagons) and not to be used for new vehicles placed in service') ]
  },
  {
    pattern: /[0-3]0/,
    defs: [ C.ParseWarnings.value('Wagons with starting digits 0-3 followed by 0 are not to be used according to Part 6 of the \'Operation and Traffic Management’ UIC manual (2011)') ]
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
  { pattern: /[48][1-8]/, defs: [ V.MiscPassengerVehicleNote ] },

  // General description
  { pattern: /[567]6/, defs: [ V.TEN_COTIF_WagonNote ] },
  { pattern: /[567][789]/, defs: [ V.PPV_PPW_WagonNote ] },
  { pattern: /[567][1234]/, defs: [ V.TEN_COTIF_WagonNote, V.PPV_PPW_WagonNote ] },
 
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
    defs: [ V.VehicleNotes.value('Passenger vehicles starting with digits \'53\' are not to be used according to Part 7 of the \'Operation and Traffic Management’ UIC manual (2011).') ]
  },
  {
    pattern: /7[1246789]/,
    defs: [ V.VehicleNotes.value('Passenger vehicles starting with digit 7 followed by 1, 2, 4, 6, 7, 8, or 9 are not to be used according to Part 7 of the \'Operation and Traffic Management’ UIC manual (2011).') ]
  },
  {
    pattern: /[56]6/,
    defs: [ V.VehicleNotes.value('Passenger vehicles starting with digits \'56\' or \'66\' are not to be used, but are excepted for coaches with fixed gauge (\'56\') and adjustable gauge (\'66\') already in service and not to be used for new vehicles.') ]
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