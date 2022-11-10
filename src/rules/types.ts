import { ValueDef } from '../attributes/builders'
import { Rule } from '../util/common'

import * as A from '../attributes/vehicles/uic-type-code'
import * as C from '../attributes/vehicles/common-fields'
import * as T from '../attributes/vehicles/tractive'
import { GaugesByDist } from '../attributes/gauge'

import { Node } from 'ohm-js'
import { applyDigitRules } from './helpers'


// ---- General rules (first digit only) -----------------------------
const UICTypeRulesD1: Rule[] = [
  // Vehicle type
  { pattern: /[012348]/, defs: [ A.WagonVehicle ] },
  { pattern: /[567]/, defs: [ A.HauledPassenger ] },
  { pattern: /9/, defs: [ A.TractiveVehicle ] },

  // Wagon - Suspension (axles or bogies)
  { pattern: /[024]/, defs: [ A.Axles ] },
  { pattern: /[138]/, defs: [ A.Bogies ] },

  // Wagons - Traffic (domestic/international)
  { pattern: /[012348]/, defs: [ A.DomesticInternational ] }
]

// ---- Wagons -------------------------------------------------------
const UICWagonTypeRules: Rule[] = [

  // Track gauge type (fixed or variable)
  { pattern: /[012348][1357]/, defs: [ A.FixedGauge ] },
  { pattern: /[012348][2468]/, defs: [ A.VariableGauge ] },
  { pattern: /[01]9/, defs: [ A.VariableGauge ] },
  { pattern: /[23]9/, defs: [ A.FixedGauge ] },

  // General description
  { pattern: /[48]0/, defs: [ C.MaintenanceWagonNote ] },
  { pattern: /[01][12]/, defs: [ C.TEN_COTIF_WagonNote ] },
  { pattern: /[23][1-8]/, defs: [ C.TEN_COTIF_WagonNote ] },
  { pattern: /[48][1-8]/, defs: [ C.MiscWagonNote ] },
  { pattern: /[0-3]9/, defs: [ C.PPV_PPW_WagonNote ] },
  { pattern: /[48][9]/, defs: [ C.SpecialNumberedWagonNote ] },

  // "Not to be used" blocks
  {
    pattern: /[01][3-8]/,
    defs: [ C.VehicleNotes.value('Wagons with starting digits 0 or 1 followed by 3-8 are not to be used, but are excepted for wagons in category I (temperature-controlled wagons) and not to be used for new vehicles placed in service.') ]
  },
  {
    pattern: /[0-3]0/,
    defs: [ C.VehicleNotes.value('Wagons with starting digits 0-3 followed by 0 are not to be used according to Part 6 of the \'Operation and Traffic Management’ UIC manual (2011).') ]
  }
]

// ---- Passenger stock ----------------------------------------------
const UICPassengerTypeRules: Rule[] = [
  // Traffic
  { pattern: /[567]0/, defs: [ A.Domestic ] },
  { pattern: /[567]5/, defs: [ A.DomesticInternational ] },

  // Track gauge type (fixed or variable)
  { pattern: /[56][17]/, defs: [ A.FixedGauge ] },
  { pattern: /73/, defs: [ A.FixedGauge ] },
  { pattern: /[56][2489]/, defs: [ A.VariableGauge ] },

  // Air conditioning
  { pattern: /7[03]/, defs: [ A.AirConditioned ] },
  { pattern: /6[124]/, defs: [ A.AirConditioned ] },
  { pattern: /5[124]/, defs: [ A.NonAirConditioned ] },
  
  // Historic vehicles
  { pattern: /55/, defs: [ A.HistoricVehicle ] },
  
  // Car carrying wagons
  { pattern: /65/, defs: [ A.CarCarrier ] },
  
  // Miscellaneous vehicles
  { pattern: /[48][1-8]/, defs: [ C.MiscPassengerVehicleNote ] },

  // General description
  { pattern: /[567]6/, defs: [ C.TEN_COTIF_WagonNote ] },
  { pattern: /[567][789]/, defs: [ C.PPV_PPW_WagonNote ] },
  { pattern: /[567][1234]/, defs: [ C.TEN_COTIF_WagonNote, C.PPV_PPW_WagonNote ] },
 
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
    defs: [ C.VehicleNotes.value('Passenger vehicles starting with digits \'53\' are not to be used according to Part 7 of the \'Operation and Traffic Management’ UIC manual (2011).') ]
  },
  {
    pattern: /7[1246789]/,
    defs: [ C.VehicleNotes.value('Passenger vehicles starting with digit 7 followed by 1, 2, 4, 6, 7, 8, or 9 are not to be used according to Part 7 of the \'Operation and Traffic Management’ UIC manual (2011).') ]
  },
  {
    pattern: /[56]6/,
    defs: [ C.VehicleNotes.value('Passenger vehicles starting with digits \'56\' or \'66\' are not to be used, but are excepted for coaches with fixed gauge (\'56\') and adjustable gauge (\'66\') already in service and not to be used for new vehicles.') ]
  }
]

// ---- Tractive stock -----------------------------------------------
const UICTractiveTypeRules: Rule[] = [
  { pattern: /90/, defs: [ T.MiscellaneousVehicle ] },
  { pattern: /91/, defs: [ T.ElectricLocomotive, C.ElectricTraction ] },
  { pattern: /92/, defs: [ T.DieselLocomotive, C.DieselTraction ] },
  { pattern: /93/, defs: [ T.HighSpeedElectricMultiUnitSet, C.ElectricTraction ] },
  { pattern: /94/, defs: [ T.LowSpeedElectricMultiUnitSet, C.ElectricTraction ] },
  { pattern: /95/, defs: [ T.DieselMultiUnitSet, C.DieselTraction ] },
  { pattern: /96/, defs: [ T.SpecialisedTrailer ] },
  { pattern: /97/, defs: [ T.ElectricShunter, C.ElectricTraction ] },
  { pattern: /98/, defs: [ T.DieselShunter ] },
  { pattern: /99/, defs: [ T.SpecialVehicle ] }
]

// Returns vehicle attributes for the given Ohm parse node of wagon unit type codes
export const uicWagonTypeCode = applyDigitRules(UICTypeRulesD1, UICWagonTypeRules)

// Returns vehicle attributes for the given Ohm parse node of hauled-passenger unit type codes
export const uicPassengerTypeCode = applyDigitRules(UICTypeRulesD1, UICPassengerTypeRules)

// Returns vehicle attributes for the given Ohm parse node of tractive unit type codes
export const uicTractiveTypeCode = applyDigitRules(UICTypeRulesD1, UICTractiveTypeRules)