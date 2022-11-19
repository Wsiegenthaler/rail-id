import { Field } from '..'
import { readableSpeedRange, SpeedRange, YesNoMaybe } from '../common-values'


// Special Type (tractives)
const SpecialType = new Field<string>('Special Type', 'special.type')

export const InfrastructureVehicle   = SpecialType.value('Infrastructure and Superstructure')
export const TrackVehicle            = SpecialType.value('Track')
export const OverheadLineVehicle     = SpecialType.value('Overhead Line')
export const StructuresVehicle       = SpecialType.value('Structures')
export const LoadingVehicle          = SpecialType.value('Loading, Unloading and Various Transport')
export const MeasuringVehicle        = SpecialType.value('Measuring')
export const EmergencyVehicle        = SpecialType.value('Emergency')
export const TransportEnergyVehicle  = SpecialType.value('Traction, Transport, Energy, etc')
export const EnvironmentVehicle      = SpecialType.value('Environment')
export const RailOrRoadVehicle       = SpecialType.value('Rail/Road')


// Special Sub-Type field
const SpecialSubType = new Field<string>('Special Sub-Type', 'special.subtype')

// Special Sub-Type - Infrastructure and superstructure
export const TrackLayer           = SpecialSubType.value('Track laying and renewal train')
export const SwitchLayer          = SpecialSubType.value('Switches and crossing laying equipment')
export const TrackRehabTrain      = SpecialSubType.value('Track rehabilitation train')
export const BallastCleaner       = SpecialSubType.value('Ballast cleaning machine')
export const EarthworksMachine    = SpecialSubType.value('Earthworks machine')
export const Crane                = SpecialSubType.value('Rail-mounted crane (excl. re-railing)')

// Special Sub-Type - Track
export const HiCapTamper          = SpecialSubType.value('High capacity plain track tamping machine')
export const PlainTamper          = SpecialSubType.value('Other plain track tamping machines')
export const StabilisedTamper     = SpecialSubType.value('Tamping machine with stabilisation')
export const SwitchTamper         = SpecialSubType.value('Tamping machine for switches and crossings')
export const BallastPlough        = SpecialSubType.value('Ballast plough')
export const Stabiliser           = SpecialSubType.value('Stabilisation machine')
export const GrinderWelder        = SpecialSubType.value('Grinding and welding machine multi-purpose machine')
export const TrackInspection      = SpecialSubType.value('Track inspection car')

// Special Sub-Type - Overhead line
export const MultiPurpose         = SpecialSubType.value('Multi-purpose machine')
export const RollerUnroller       = SpecialSubType.value('Rolling and unrolling machine')
export const MastInstaller        = SpecialSubType.value('Mast installation machine')
export const DrumCarrier          = SpecialSubType.value('Drum carrier machine')
export const LineTensioner        = SpecialSubType.value('Overhead line tensioning machine')
export const Scaffold             = SpecialSubType.value('Machine with elevating work platform or scaffold')
export const CleaningTrain        = SpecialSubType.value('Cleaning train')
export const GreasingTrain        = SpecialSubType.value('Greasing train')
export const LineInspector        = SpecialSubType.value('Overhead line inspection car')

// Special Sub-Type - Structures
export const DeckLayer            = SpecialSubType.value('Deck laying machine')
export const BridgeInspector      = SpecialSubType.value('Bridge inspection platform')
export const TunnelInspector      = SpecialSubType.value('Tunnel inspection platform')
export const GasPurifier          = SpecialSubType.value('Gas purification machine')
export const Ventilator           = SpecialSubType.value('Ventilation machine')
export const TunnelLight          = SpecialSubType.value('Tunnel lighting machine')

// Special Sub-Type - Loading, unloading and various transport
export const RailLoader           = SpecialSubType.value('Rail loading/unloading and transport machine')
export const BallastLoader        = SpecialSubType.value('Loading/unloading and transport machine for ballast, gravel, etc')
export const SleeperLoader        = SpecialSubType.value('Sleeper loading/unloading and transport machine')
export const SwitchgearLoader     = SpecialSubType.value('Loading/unloading and transport machine for switchgear, etc')
export const MiscLoader           = SpecialSubType.value('Loading/unloading and transport machine for other materials')

// Special Sub-Type - Measuring
export const EarthworksRecorder   = SpecialSubType.value('Earthworks recording car')
export const TrackRecorder        = SpecialSubType.value('Track recording car')
export const OverheadLineRecorder = SpecialSubType.value('Overhead line recording car')
export const GaugeRecorder        = SpecialSubType.value('Gauge recording car')
export const SignalRecorder       = SpecialSubType.value('Signalling recording car')
export const TelecomRecorder      = SpecialSubType.value('Telecommunications recording car')

// Special Sub-Type - Emergency
export const EmergencyCrane       = SpecialSubType.value('Emergency crane')
export const EmergencyHauler      = SpecialSubType.value('Emergency haulage car')
export const EmergencyTunnelTrain = SpecialSubType.value('Emergency tunnel train')
export const EmergencyCar         = SpecialSubType.value('Emergency car')
export const FireCar              = SpecialSubType.value('Fire car')
export const SanitaryVehicle      = SpecialSubType.value('Sanitary vehicle')
export const EquipmentCar         = SpecialSubType.value('Equipment car')

// Special Sub-Type - Traction, transport, energy, etc
export const TractiveUnit         = SpecialSubType.value('Tractive unit')
export const TransportCar         = SpecialSubType.value('Transport car')
export const PowerCar             = SpecialSubType.value('Power car')
export const TrackCar             = SpecialSubType.value('Track car / powered car')
export const ConcretingTrain      = SpecialSubType.value('Concreting train')

// Special Sub-Type - Environment
export const PropelledSnowPlough  = SpecialSubType.value('Self-propelled snow plough')
export const HauledSnowPlough     = SpecialSubType.value('Hauled snow plough')
export const SnowBroom            = SpecialSubType.value('Snow broom')
export const DeIcingMachine       = SpecialSubType.value('De-icing machine')
export const WeedKiller           = SpecialSubType.value('Weed-killing machine')
export const RailCleaner          = SpecialSubType.value('Rail cleaning machine')

// Special Sub-Type - Rail/road
export const Category1Machine     = SpecialSubType.value('Category 1 rail/road machine')
export const Category2Machine     = SpecialSubType.value('Category 2 rail/road machine')
export const Category3Machine     = SpecialSubType.value('Category 3 rail/road machine')
export const Category4Machine     = SpecialSubType.value('Category 4 rail/road machine')

// Special Sub-Type - Other
export const Other                = SpecialSubType.value('Other')


// Train Compatibility
const TrainCompatibility = new Field<YesNoMaybe>('Train Compatibility', 'trainCompatible', { desc: 'The ability to include this vehicle as part of a train' })
export const TrainCompatible = TrainCompatibility.value('Yes', 'This vehicle can be made part of a train')
export const NotTrainCompatible = TrainCompatibility.value('No', 'This vehicle cannot be made part of a train')
export const MaybeTrainCompatible = TrainCompatibility.value('Maybe', 'Special conditions concerning inclusion in a train must be complied with.')

// Self-propelled travelling speed
export const SelfPropelledMaxSpeed = new Field<SpeedRange>('Self-Propelled Speed', 'selfSpeed', {
  desc: 'The maximum speed of this vehicle while travelling under its own tractive power',
  readableFn: readableSpeedRange
})
