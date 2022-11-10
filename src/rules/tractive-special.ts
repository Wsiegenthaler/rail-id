import * as C from '../attrs/vehicles/common'
import * as S from '../attrs/vehicles/tractive-special'
import { applyDigitRules, applySingleDigitRules, Rule } from '.'


// ---- Special tractive rules (digit 6 only) --------------------
const UICTractiveSpecialRulesD6: Rule[] = [
  // Train compatibility
  { pattern: /[123458]/, defs: [ S.TrainCompatibility.value('yes') ] },
  { pattern: /[679]/, defs: [ S.TrainCompatibility.value('no') ] },
  { pattern: /0/, defs: [ S.TrainCompatibility.value('maybe', 'Special conditions concerning inclusion in a train must be complied with.') ] },

  // Self-propulsion
  { pattern: /[124689]/, defs: [ C.SelfPropelled.value('yes') ] },
  { pattern: /[3570]/, defs: [ C.SelfPropelled.value('no') ] },

  // Max speed
  { pattern: /[45]/, defs: [ C.AllowedSpeeds.value({ max: 100, unit: 'km/h' }) ] },
  { pattern: /[123]/, defs: [ C.AllowedSpeeds.value({ min: 100, unit: 'km/h' }) ] },

  // Self-propelled travelling speed
  { pattern: /1/, defs: [ S.SelfPropelledMaxSpeed.value({ min: 100, unit: 'km/h' }) ] },
  { pattern: /[24689]/, defs: [ S.SelfPropelledMaxSpeed.value({ max: 100, unit: 'km/h' }) ] },

  // Notes
  { pattern: /[890]/, defs: [ C.VehicleNotes.value('Special conditions concerning inclusion in a train must be complied with.') ] }
]

// ---- General rules (digit 7 only) -----------------------------
const UICTractiveSpecialRulesD7: Rule[] = [
  // Special vehicle type
  { pattern: /0/, defs: [ S.RailOrRoadVehicle ] },
  { pattern: /1/, defs: [ S.InfrastructureVehicle ] },
  { pattern: /2/, defs: [ S.TrackVehicle ] },
  { pattern: /3/, defs: [ S.OverheadLineVehicle ] },
  { pattern: /4/, defs: [ S.StructuresVehicle ] },
  { pattern: /5/, defs: [ S.LoadingVehicle ] },
  { pattern: /6/, defs: [ S.MeasuringVehicle ] },
  { pattern: /7/, defs: [ S.EmergencyVehicle ] },
  { pattern: /8/, defs: [ S.TransportEnergyVehicle ] },
  { pattern: /9/, defs: [ S.EnvironmentVehicle ] },
]

// ---- Special Tractives (both digits 7 and 8) ----------------------
const UICTractiveSpecialRulesD78: Rule[] = [

  // Infrastructure and superstructure
  { pattern: /11/, defs: [ S.TrackLayer ] },
  { pattern: /12/, defs: [ S.SwitchLayer ] },
  { pattern: /13/, defs: [ S.TrackRehabTrain ] },
  { pattern: /14/, defs: [ S.BallastCleaner ] },
  { pattern: /1[56]/, defs: [ S.EarthworksMachine ] },
  { pattern: /19/, defs: [ S.Crane ] },

  // Track
  { pattern: /21/, defs: [ S.HiCapTamper ] },
  { pattern: /22/, defs: [ S.PlainTamper ] },
  { pattern: /23/, defs: [ S.StabilisedTamper ] },
  { pattern: /24/, defs: [ S.SwitchTamper ] },
  { pattern: /25/, defs: [ S.BallastPlough ] },
  { pattern: /26/, defs: [ S.Stabiliser ] },
  { pattern: /27/, defs: [ S.GrinderWelder ] },
  { pattern: /28/, defs: [ S.MultiPurpose ] },
  { pattern: /29/, defs: [ S.TrackInspection ] },

  // Overhead line
  { pattern: /31/, defs: [ S.MultiPurpose ] },
  { pattern: /32/, defs: [ S.RollerUnroller ] },
  { pattern: /33/, defs: [ S.MastInstaller ] },
  { pattern: /34/, defs: [ S.DrumCarrier ] },
  { pattern: /35/, defs: [ S.LineTensioner ] },
  { pattern: /36/, defs: [ S.Scaffold ] },
  { pattern: /37/, defs: [ S.CleaningTrain ] },
  { pattern: /38/, defs: [ S.GreasingTrain ] },
  { pattern: /39/, defs: [ S.LineInspector ] },

  // Structures
  { pattern: /41/, defs: [ S.DeckLayer ] },
  { pattern: /42/, defs: [ S.BridgeInspector ] },
  { pattern: /43/, defs: [ S.TunnelInspector ] },
  { pattern: /44/, defs: [ S.GasPurifier ] },
  { pattern: /45/, defs: [ S.Ventilator ] },
  { pattern: /46/, defs: [ S.Scaffold ] },
  { pattern: /47/, defs: [ S.TunnelLight ] },

  // Loading, unloading and various transport
  { pattern: /51/, defs: [ S.RailLoader ] },
  { pattern: /5[234]/, defs: [ S.BallastLoader ] },
  { pattern: /5[567]/, defs: [ S.SleeperLoader ] },
  { pattern: /58/, defs: [ S.SwitchgearLoader ] },
  { pattern: /59/, defs: [ S.MiscLoader ] },

  // Measuring
  { pattern: /61/, defs: [ S.EarthworksRecorder ] },
  { pattern: /62/, defs: [ S.TrackRecorder ] },
  { pattern: /63/, defs: [ S.OverheadLineRecorder ] },
  { pattern: /64/, defs: [ S.GaugeRecorder ] },
  { pattern: /65/, defs: [ S.SignalRecorder ] },
  { pattern: /66/, defs: [ S.TelecomRecorder ] },

  // Emergency
  { pattern: /71/, defs: [ S.EmergencyCrane ] },
  { pattern: /72/, defs: [ S.EmergencyHauler ] },
  { pattern: /73/, defs: [ S.EmergencyTunnelTrain ] },
  { pattern: /74/, defs: [ S.EmergencyCar ] },
  { pattern: /75/, defs: [ S.FireCar ] },
  { pattern: /76/, defs: [ S.SanitaryVehicle ] },
  { pattern: /77/, defs: [ S.EquipmentCar ] },

  // Traction, transport, energy, etc
  { pattern: /8[12]/, defs: [ S.TractiveUnit ] },
  { pattern: /83/, defs: [ S.TransportCar ] },
  { pattern: /84/, defs: [ S.PowerCar ] },
  { pattern: /8[56]/, defs: [ S.TrackCar ] },
  { pattern: /87/, defs: [ S.ConcretingTrain ] },

  // Environment
  { pattern: /91/, defs: [ S.PropelledSnowPlough ] },
  { pattern: /92/, defs: [ S.HauledSnowPlough ] },
  { pattern: /93/, defs: [ S.SnowBroom ] },
  { pattern: /94/, defs: [ S.DeIcingMachine ] },
  { pattern: /95/, defs: [ S.WeedKiller ] },
  { pattern: /96/, defs: [ S.RailCleaner ] },

  // Rail/road
  { pattern: /0[12]/, defs: [ S.Category1Machine ] },
  { pattern: /0[34]/, defs: [ S.Category2Machine ] },
  { pattern: /0[56]/, defs: [ S.Category3Machine ] },
  { pattern: /0[78]/, defs: [ S.Category4Machine ] },

  // Other
  { pattern: /.0/, defs: [ S.Other ] }
]

// Returns vehicle attributes for the given Ohm parse node of digits 7 and 8 of special tractive units
export const uicSpecialTractiveD78 = applyDigitRules(UICTractiveSpecialRulesD7, UICTractiveSpecialRulesD78)

// Returns vehicle attributes for the given Ohm parse node of digit 6 of special tractive units
export const uicSpecialTractiveD6 = applySingleDigitRules(UICTractiveSpecialRulesD6)