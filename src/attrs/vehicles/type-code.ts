import { Field } from '..'
import { YesNo } from '../common-values'


// Vehicle type/subtype
const VehicleType = new Field('Vehicle Type', 'type')

export const WagonVehicle    = VehicleType.value('Wagon')
export const HauledPassenger = VehicleType.value('Hauled-passenger Car')
export const TractiveVehicle = VehicleType.value('Tractive Vehicle')
export const SpecialVehicle  = VehicleType.value('Special Vehicle')

// Vehicle suspension
const Suspension = new Field('Suspension', 'suspension')

export const Axles           = Suspension.value('Axles')
export const Bogies          = Suspension.value('Bogies')

// Track gauge (fixed/variable)
type GaugeType = 'Fixed Gauge' | 'Variable Gauge'
const GaugeType = new Field<GaugeType>('Gauge Type', 'gaugeType')

export const FixedGauge      = GaugeType.value('Fixed Gauge', 'This vehicle supports only one track gauge')
export const VariableGauge   = GaugeType.value('Variable Gauge', 'This vehicle supports operation on more than one track gauge')

// Type of traffic (domestic/international)
const TrafficType = new Field<string>('Traffic Type', 'traffic')

export const Domestic              = TrafficType.value('Domestic')
export const International         = TrafficType.value('International')
export const DomesticInternational = TrafficType.value('Domestic / International', 'Domestic or international by special agreement')

// Air conditioning
export const AirConditioned = new Field<YesNo>('Air Conditioning', 'airConditioning')

// Historic vehicles
export const HistoricVehicle = new Field<YesNo>('Historic Vehicle', 'historic').value('yes')

// Car carrying wagons
export const CarCarrier = new Field<YesNo>('Car Carrying Vehicle', 'carCarrier').value('yes')
  
// Service vehicles
export const ServiceVehicle = new Field<YesNo>('Service Vehicle', 'serviceVehicle').value('yes')

// Pressure-tight vehicles
export const PressurizedVehicle = new Field<YesNo>('Pressure-tight Vehicle', 'pressurized').value('yes')
