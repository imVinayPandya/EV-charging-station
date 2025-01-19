import { ChargingEvent } from "@prisma/client";

const NO_OF_HOURS = 24;
const DAYS_IN_A_YEAR = 365;

type MockChargingEvent = Omit<ChargingEvent, "id" | "createdAt" | "updatedAt">;

const mockChargingEvents = (
  simulationResultId: number
): MockChargingEvent[] => {
  const chargingEvents: MockChargingEvent[] = [];
  const totalEvents = NO_OF_HOURS * DAYS_IN_A_YEAR;

  for (let i = 0; i < totalEvents; i++) {
    const startTime = new Date(new Date().setHours(i));
    startTime.setMinutes(0, 0, 0);

    const consumption = Math.random() * 1000;
    const noOfCars = Math.floor(Math.random() * 10) + 1;
    chargingEvents.push({
      simulationResultId,
      startTime,
      consumption,
      noOfCars,
    });
  }

  return chargingEvents;
};

export default mockChargingEvents;
