import { useState } from "react";
import { getSimulationChargingEvents, runSimulation } from "./api/simulation";
import { saveSimulationConfig } from "./api/simulation";
import ChartComponent from "./components/ChargingEventsChart";
import SimulationForm from "./components/SimulationForm";
import {
  ChargingEventResponse,
  SimulationConfig,
  SimulationResultResponse,
} from "./types";

function App() {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResultResponse | null>(null);
  const [chargingEvents, setChargingEvents] = useState<
    ChargingEventResponse[] | null
  >(null);

  const handleSubmit = async (params: SimulationConfig) => {
    setIsLoading(true);
    try {
      const simulationConfig = await saveSimulationConfig(params);
      const simulationResult = await runSimulation(simulationConfig.id);
      const chargingEvents = await getSimulationChargingEvents(
        simulationResult.id
      );
      setChargingEvents(chargingEvents);
      setSimulationResult(simulationResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSimulationResult(null);
    setChargingEvents(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center ">
      <div className="flex flex-col w-full max-w-6xl gap-16 py-16">
        <h1 className="text-4xl font-bold text-center">
          EV Charging Simulator
        </h1>
        <SimulationForm
          onSubmit={handleSubmit}
          onReset={handleReset}
          isLoading={isLoading}
        />

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {simulationResult && (
              <div className="flex flex-col gap-4">
                <div
                  className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                  role="alert"
                >
                  <p className="font-bold">Warning</p>
                  <p>
                    These results are based on a mock data generated on backend.
                    It is not calculated based on{" "}
                    <span className="font-bold ">
                      Above Simulation Parameter
                    </span>
                    .
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-bold">Simulation Result</h1>
                  <p>
                    <span className="font-bold"> Total Energy Charged:</span>{" "}
                    {simulationResult.totalEnergyCharged.toFixed(2)} kWh
                  </p>
                  <p>
                    <span className="font-bold">Max Power Demand:</span>{" "}
                    {simulationResult.maxPowerDemand.toFixed(2)} kW
                  </p>
                  <p>
                    <span className="font-bold">Concurrency Factor:</span>{" "}
                    {(simulationResult.concurrencyFactor * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            )}

            {chargingEvents && (
              <ChartComponent chargingEvents={chargingEvents} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
