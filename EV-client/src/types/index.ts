export type SimulationConfig = {
  chargePoints: number;
  arrivalMultiplier: number;
  carConsumption: number;
  chargingPower: number;
};

export type SimulationConfigResponse = SimulationConfig & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type SimulationResult = {
  inputId: number;
  totalEnergyCharged: number;
  maxPowerDemand: number;
  concurrencyFactor: number;
};

export type SimulationResultResponse = SimulationResult & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type ChargingEvent = {
  simulationResultId: number;
  startTime: string;
  consumption: number;
  noOfCars: number;
};

export type ChargingEventResponse = ChargingEvent & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type ChargingEventGroupBy = "hour" | "day" | "month" | "year";
