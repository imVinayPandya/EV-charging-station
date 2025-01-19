const NUM_CHARGE_POINTS = 20; // total number of charge points
const CHARGING_POWER_KW_PER_POINT = 11; // charging power in kW per charging station
const INTERVALS_PER_DAY = 24 * 4; // 4 = 15-minute intervals per hour
const DAYS_PER_YEAR = 365;
const TOTAL_INTERVALS = INTERVALS_PER_DAY * DAYS_PER_YEAR;
const CAR_CONSUMPTION_KWH_PER_100KM = 18; // car consumption in kWh per 100 km
const theoreticalMaxPowerDemand =
  NUM_CHARGE_POINTS * CHARGING_POWER_KW_PER_POINT;

// Table T1: Arrival Probabilities per hour
// Here index is the hour of the day, 0 to 23
const arrivalProbabilities: number[] = [
  0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0283,
  0.0283, 0.0566, 0.0566, 0.0566, 0.0755, 0.0755, 0.0755, 0.1038, 0.1038,
  0.1038, 0.0472, 0.0472, 0.0472, 0.0094, 0.0094,
];

// Table T2: Charging Demand Probabilities (in km)
const chargingDemandDist = [
  { km: 0, prob: 0.3431 },
  { km: 5, prob: 0.049 },
  { km: 10, prob: 0.098 },
  { km: 20, prob: 0.1176 },
  { km: 30, prob: 0.0882 },
  { km: 50, prob: 0.1176 },
  { km: 100, prob: 0.1078 },
  { km: 200, prob: 0.049 },
  { km: 300, prob: 0.0294 },
];

// Check if a car arrives at a charge point at a given hour
const checkIfCarArrives = (hour: number): boolean => {
  return Math.random() < arrivalProbabilities[hour];
};

// Generate random charging demand
const generateChargingDemand = (): number => {
  let rand = Math.random();
  let cumulativeProb = 0;
  for (const { km, prob } of chargingDemandDist) {
    cumulativeProb += prob;
    if (rand < cumulativeProb)
      return (km / 100) * CAR_CONSUMPTION_KWH_PER_100KM;
  }
  return 0;
};

const runSimulation = () => {
  let actualMaxPowerDemand = 0;
  let totalEnergyConsumed = 0;
  let totalCarArrived = 0;
  let totalCarCharged = 0;

  const chargePoints: (number | null)[] = Array(NUM_CHARGE_POINTS).fill(null);

  // Run simulation loop for total intervals
  for (let interval = 0; interval < TOTAL_INTERVALS; interval++) {
    const currentHour = Math.floor((interval % INTERVALS_PER_DAY) / 4); // Get current hour
    let currentPowerDemand = 0; // Calculate current power demand per interval (15 minutes)

    for (let i = 0; i < NUM_CHARGE_POINTS; i++) {
      // Check if car arrives at a charge point at a given hour
      const hasCarArrived = checkIfCarArrives(currentHour);

      // if car arrives and charge point is available, charge car
      if (chargePoints[i] === null && hasCarArrived) {
        totalCarArrived++;

        const energyNeeded = generateChargingDemand(); // Generate charging demand
        if (energyNeeded > 0) {
          totalCarCharged++;

          const chargingTime = Math.ceil(
            (energyNeeded / CHARGING_POWER_KW_PER_POINT) * 4
          ); // calculate total time to charge car in 15-minute intervals

          chargePoints[i] = chargingTime;
          currentPowerDemand += CHARGING_POWER_KW_PER_POINT;
          totalEnergyConsumed += energyNeeded;
        }

        // else check if charging point is occupied
      } else if (chargePoints[i] !== null) {
        chargePoints[i]! -= 1; // reduce the time left for charging
        // if time left is greater than 0, add power needed for charging to current power demand
        if (chargePoints[i]! > 0) {
          currentPowerDemand += CHARGING_POWER_KW_PER_POINT;
        } else {
          chargePoints[i] = null;
        }
      }

      // if car arrives and charge point is not available, do nothing
      // if car does not arrive, do nothing
    }

    // update actual max power demand
    actualMaxPowerDemand = Math.max(actualMaxPowerDemand, currentPowerDemand);
  }

  return {
    actualMaxPowerDemand,
    totalEnergyConsumed,
    totalCarArrived,
    totalCarCharged,
  };
};

const {
  actualMaxPowerDemand,
  totalEnergyConsumed,
  totalCarArrived,
  totalCarCharged,
} = runSimulation();
const concurrencyFactor = actualMaxPowerDemand / theoreticalMaxPowerDemand;
const missedCars = totalCarArrived - totalCarCharged;

console.table({
  "Total Energy Consumed": `${totalEnergyConsumed.toFixed(2)} kWh`,
  "Theoretical Max Power Demand": `${theoreticalMaxPowerDemand} kW`,
  "Actual Max Power Demand": `${actualMaxPowerDemand} kW`,
  "Concurrency Factor": `${(concurrencyFactor * 100).toFixed(2)}%`,
  "Total Arrivals": totalCarArrived,
  "Total Charging Events": totalCarCharged,
  "Missed Cars": missedCars,
});
