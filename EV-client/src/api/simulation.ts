import axios from "axios";
import {
  SimulationConfig,
  SimulationConfigResponse,
  SimulationResultResponse,
  ChargingEventResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const saveSimulationConfig = async (
  config: SimulationConfig
): Promise<SimulationConfigResponse> => {
  const response = await axiosInstance.post<SimulationConfigResponse>(
    `/api/simulation/config`,
    config
  );
  return response.data;
};

export const runSimulation = async (
  simulationId: number
): Promise<SimulationResultResponse> => {
  const response = await axiosInstance.post<SimulationResultResponse>(
    `/api/simulation/${simulationId}`
  );
  return response.data;
};

export const getSimulationChargingEvents = async (
  simulationResultId: number
): Promise<ChargingEventResponse[]> => {
  const response = await axiosInstance.get<ChargingEventResponse[]>(
    `/api/simulation/${simulationResultId}/charging-events`
  );
  return response.data;
};
