import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SimulationConfig } from "../types";

interface SimulationFormProps {
  onSubmit: (params: SimulationConfig) => void;
  onReset: VoidFunction;
  isLoading: boolean;
}

export const simulationConfigSchema = z.object({
  chargePoints: z.coerce.number().int().min(1),
  arrivalMultiplier: z.coerce.number().min(20).max(200).default(100),
  carConsumption: z.coerce.number().min(1),
  chargingPower: z.coerce.number().min(1),
});

const SimulationForm: React.FC<SimulationFormProps> = ({
  onSubmit,
  onReset,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SimulationConfig>({
    defaultValues: {
      chargePoints: 20,
      arrivalMultiplier: 100,
      carConsumption: 18,
      chargingPower: 11,
    },
    resolver: zodResolver(simulationConfigSchema),
  });

  const handleReset = () => {
    reset();
    onReset();
  };

  const errorInputClass =
    "border-red-500 focus:border-red-500 focus:outline-red-500";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Number of Charge Points
            </label>
            <input
              type="number"
              {...register("chargePoints")}
              className={`w-full mt-1 p-2 border rounded-md ${
                errors.chargePoints ? errorInputClass : ""
              }`}
            />
            {errors.chargePoints && (
              <p className="text-red-500 text-xs mt-1">
                {errors.chargePoints.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex flex-row w-full align-center justify-between">
              <label className="block text-sm font-medium">
                Arrival Multiplier <span className="text-xs">(20-200%)</span>
              </label>
              <label className="block text-sm font-medium">
                {watch("arrivalMultiplier")}%
              </label>
            </div>
            <input
              type="range"
              {...register("arrivalMultiplier")}
              min="20"
              max="200"
              step="10"
              className="w-full mt-1 cursor-pointer"
            />
            {errors.arrivalMultiplier && (
              <p className="text-red-500 text-xs mt-1">
                {errors.arrivalMultiplier.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Car Consumption (kWh per 100 km)
            </label>
            <input
              type="number"
              {...register("carConsumption")}
              className={`w-full mt-1 p-2 border rounded-md ${
                errors.carConsumption ? errorInputClass : ""
              }`}
            />
            {errors.carConsumption && (
              <p className="text-red-500 text-xs mt-1">
                {errors.carConsumption.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Charging Power per Chargepoint (kW)
            </label>
            <input
              type="number"
              {...register("chargingPower")}
              className={`w-full mt-1 p-2 border rounded-md ${
                errors.chargingPower ? errorInputClass : ""
              }`}
            />
            {errors.chargingPower && (
              <p className="text-red-500 text-xs mt-1">
                {errors.chargingPower.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Run Simulation"}
          </button>

          <button
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md"
            type="button"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimulationForm;
