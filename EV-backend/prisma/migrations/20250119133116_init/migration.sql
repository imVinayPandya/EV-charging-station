-- CreateTable
CREATE TABLE "SimulationConfig" (
    "id" SERIAL NOT NULL,
    "chargePoints" INTEGER NOT NULL,
    "arrivalMultiplier" DOUBLE PRECISION NOT NULL,
    "carConsumption" DOUBLE PRECISION NOT NULL,
    "chargingPower" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" SERIAL NOT NULL,
    "simulationConfigId" INTEGER NOT NULL,
    "totalEnergyCharged" DOUBLE PRECISION NOT NULL,
    "maxPowerDemand" DOUBLE PRECISION NOT NULL,
    "concurrencyFactor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargingEvent" (
    "id" SERIAL NOT NULL,
    "simulationResultId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "consumption" DOUBLE PRECISION NOT NULL,
    "noOfCars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChargingEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_simulationConfigId_fkey" FOREIGN KEY ("simulationConfigId") REFERENCES "SimulationConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingEvent" ADD CONSTRAINT "ChargingEvent_simulationResultId_fkey" FOREIGN KEY ("simulationResultId") REFERENCES "SimulationResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
