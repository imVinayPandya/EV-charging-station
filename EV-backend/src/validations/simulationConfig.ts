import { z } from "zod";

export const simulationConfigSchema = z.object({
  chargePoints: z.coerce.number().int().min(1),
  arrivalMultiplier: z.coerce.number().min(20).max(200).default(100),
  carConsumption: z.coerce.number().min(1),
  chargingPower: z.coerce.number().min(1),
});

export const numberSchema = z.coerce.number();
