import { Field } from '..'
import { YesNo } from '../common-values'


// Vehicle type/subtype
const VehicleType = new Field('Vehicle Type', 'type')

export const WagonVehicle    = VehicleType.value('Wagon', 'An unpowered railway vehicle used for the transportation of cargo')
export const HauledPassenger = VehicleType.value('Hauled-Passenger Car', 'An unpowered railway vehicle used for the transportation of passengers')
export const TractiveVehicle = VehicleType.value('Tractive Vehicle', 'A powered railway vehicle')
export const SpecialVehicle  = VehicleType.value('Special Vehicle', 'A powered railway vehicle with a special utility or purpose')

// Vehicle suspension
const Suspension = new Field('Suspension', 'suspension')

export const Axles           = Suspension.value('Axles', 'A vehicle whose wheelset is non-detachable (i.e. the axles are permanently integrated into the vehicle)')
export const Bogies          = Suspension.value('Bogies', 'A vehicle with detachable chassis or framework that carries a wheelset, often for the purpose of allowing operation on multiple rail gauges')

// Track gauge (fixed/variable)
type GaugeType = 'Fixed Gauge' | 'Variable Gauge'
const GaugeType = new Field<GaugeType>('Gauge Type', 'gaugeType')

export const FixedGauge      = GaugeType.value('Fixed Gauge', 'This vehicle supports operation on only one track gauge')
export const VariableGauge   = GaugeType.value('Variable Gauge', 'This vehicle supports operation on more than one track gauge')

// Type of traffic (domestic/international)
const TrafficType = new Field<string>('Traffic Type', 'traffic')

export const Domestic              = TrafficType.value('Domestic')
export const International         = TrafficType.value('International')
export const DomesticInternational = TrafficType.value('Domestic / International', 'Domestic or international by special agreement')

// Air conditioning
export const AirConditioned = new Field<YesNo>('Air Conditioning', 'airConditioning')

// Historic vehicles
export const HistoricVehicle = new Field<YesNo>('Historic Vehicle', 'historic', 'Heritage vehicle for purposes of tourism and historical preservation').value('Yes')

// Car carrying wagons
export const CarCarrier = new Field<YesNo>('Car Carrying Vehicle', 'carCarrier').value('Yes')
  
// Service vehicles
export const ServiceVehicle = new Field<YesNo>('Service Vehicle', 'serviceVehicle').value('Yes')

// Pressure-tight vehicles
export const PressurizedVehicle = new Field<YesNo>('Pressure-Tight Vehicle', 'pressurized').value('Yes')
