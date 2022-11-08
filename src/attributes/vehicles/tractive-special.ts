import { Field } from '../builders'


// Special Type (tractives)
const SpecialType = new Field('Special Tractives Type', 'special.type')

export const InfrastructureVehicle   = SpecialType.value('Infrastructure and superstructure')
export const TrackVehicle            = SpecialType.value('Track')
export const OverheadLineVehicle     = SpecialType.value('Overhead line')
export const StructuresVehicle       = SpecialType.value('Structures')
export const LoadingVehicle          = SpecialType.value('Loading, unloading and various transport')
export const MeasuringVehicle        = SpecialType.value('Measuring')
export const EmergencyVehicle        = SpecialType.value('Emergency')
export const TransportEnergyVehicle  = SpecialType.value('Traction, transport, energy, etc')
export const EnvironmentVehicle      = SpecialType.value('Environment')
export const RailOrRoadVehicle       = SpecialType.value('Rail/road')


// Special Sub-Type (tractives)
const SpecialSubType = new Field('Special Tractives Sub-Type', 'special.subtype')

// Infrastructure and superstructure
export const TrackLayer           = SpecialSubType.value('Track laying and renewal train')
export const SwitchLayer          = SpecialSubType.value('Switches and crossing laying equipment')
export const TrackRehabTrain      = SpecialSubType.value('Track rehabilitation train')
export const BallastCleaner       = SpecialSubType.value('Ballast cleaning machine')
export const EarthworksMachine    = SpecialSubType.value('Earthworks machine')
export const Crane                = SpecialSubType.value('Rail-mounted crane (excl. re-railing)')

// Track
export const HiCapTamper          = SpecialSubType.value('High capacity plain track tamping machine')
export const PlainTamper          = SpecialSubType.value('Other plain track tamping machines')
export const StabilisedTamper     = SpecialSubType.value('Tamping machine with stabilisation')
export const SwitchTamper         = SpecialSubType.value('Tamping machine for switches and crossings')
export const BallastPlough        = SpecialSubType.value('Ballast plough')
export const Stabiliser           = SpecialSubType.value('Stabilisation machine')
export const GrinderWelder        = SpecialSubType.value('Grinding and welding machine multi-purpose machine')
export const TrackInspection      = SpecialSubType.value('Track inspection car')

// Overhead line
export const MultiPurpose         = SpecialSubType.value('Multi-purpose machine')
export const RollerUnroller       = SpecialSubType.value('Rolling and unrolling machine')
export const MastInstaller        = SpecialSubType.value('Mast installation machine')
export const DrumCarrier          = SpecialSubType.value('Drum carrier machine')
export const LineTensioner        = SpecialSubType.value('Overhead line tensioning machine')
export const Scaffold             = SpecialSubType.value('Machine with elevating work platform or scaffold')
export const CleaningTrain        = SpecialSubType.value('Cleaning train')
export const GreasingTrain        = SpecialSubType.value('Greasing train')
export const LineInspector        = SpecialSubType.value('Overhead line inspection car')

// Structures
export const DeckLayer            = SpecialSubType.value('Deck laying machine')
export const BridgeInspector      = SpecialSubType.value('Bridge inspection platform')
export const TunnelInspector      = SpecialSubType.value('Tunnel inspection platform')
export const GasPurifier          = SpecialSubType.value('Gas purification machine')
export const Ventilator           = SpecialSubType.value('Ventilation machine')
export const TunnelLight          = SpecialSubType.value('Tunnel lighting machine')

// Loading, unloading and various transport
export const RailLoader           = SpecialSubType.value('Rail loading/unloading and transport machine')
export const BallastLoader        = SpecialSubType.value('Loading/unloading and transport machine for ballast, gravel, etc')
export const SleeperLoader        = SpecialSubType.value('Sleeper loading/unloading and transport machine')
export const SwitchgearLoader     = SpecialSubType.value('Loading/unloading and transport machine for switchgear, etc')
export const MiscLoader           = SpecialSubType.value('Loading/unloading and transport machine for other materials')

// Measuring
export const EarthworksRecorder   = SpecialSubType.value('Earthworks recording car')
export const TrackRecorder        = SpecialSubType.value('Track recording car')
export const OverheadLineRecorder = SpecialSubType.value('Overhead line recording car')
export const GaugeRecorder        = SpecialSubType.value('Gauge recording car')
export const SignalRecorder       = SpecialSubType.value('Signalling recording car')
export const TelecomRecorder      = SpecialSubType.value('Telecommunications recording car')

// Emergency
export const EmergencyCrane       = SpecialSubType.value('Emergency crane')
export const EmergencyHauler      = SpecialSubType.value('Emergency haulage car')
export const EmergencyTunnelTrain = SpecialSubType.value('Emergency tunnel train')
export const EmergencyCar         = SpecialSubType.value('Emergency car')
export const FireCar              = SpecialSubType.value('Fire car')
export const SanitaryVehicle      = SpecialSubType.value('Sanitary vehicle')
export const EquipmentCar         = SpecialSubType.value('Equipment car')

// Traction, transport, energy, etc
export const TractiveUnit         = SpecialSubType.value('Tractive unit')
export const TransportCar         = SpecialSubType.value('Transport car')
export const PowerCar             = SpecialSubType.value('Power car')
export const TrackCar             = SpecialSubType.value('Track car / powered car')
export const ConcretingTrain      = SpecialSubType.value('Concreting train')

// Environment
export const PropelledSnowPlough  = SpecialSubType.value('Self-propelled snow plough')
export const HauledSnowPlough     = SpecialSubType.value('Hauled snow plough')
export const SnowBroom            = SpecialSubType.value('Snow broom')
export const DeIcingMachine       = SpecialSubType.value('De-icing machine')
export const WeedKiller           = SpecialSubType.value('Weed-killing machine')
export const RailCleaner          = SpecialSubType.value('Rail cleaning machine')

// Rail/road
export const Category1Machine     = SpecialSubType.value('Category 1 rail/road machine')
export const Category2Machine     = SpecialSubType.value('Category 2 rail/road machine')
export const Category3Machine     = SpecialSubType.value('Category 3 rail/road machine')
export const Category4Machine     = SpecialSubType.value('Category 4 rail/road machine')

// Other
export const Other                = SpecialSubType.value('Other')
