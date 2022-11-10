import { Field } from '..'


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
const GaugeType = new Field('Gauge Type', 'gaugeType')

export const FixedGauge      = GaugeType.value('Fixed Gauge', 'This vehicle supports only one track gauge')
export const VariableGauge   = GaugeType.value('Variable Gauge', 'This vehicle supports operation on more than one track gauge')

// Type of traffic (domestic/international)
const TrafficType = new Field('Traffic Type', 'traffic')

export const Domestic              = TrafficType.value('Domestic')
export const International         = TrafficType.value('International')
export const DomesticInternational = TrafficType.value('Domestic / International', 'Domestic or international by special agreement')

// Air conditioning
const AirConditioning = new Field('Air Conditioning', 'airConditioning')

export const AirConditioned        = AirConditioning.value(true)
export const NonAirConditioned     = AirConditioning.value(false)

// Historic vehicles
export const HistoricVehicle = new Field<boolean>('Historic Vehicle', 'historic').value(true)

// Car carrying wagons
export const CarCarrier = new Field<boolean>('Car Carrying Vehicle', 'carCarrier').value(true)
  
// Service vehicles
export const ServiceVehicle = new Field<boolean>('Service Vehicle', 'serviceVehicle').value(true)

// Pressure-tight vehicles
export const PressurizedVehicle = new Field<boolean>('Pressure-tight Vehicle', 'pressurized').value(true)
