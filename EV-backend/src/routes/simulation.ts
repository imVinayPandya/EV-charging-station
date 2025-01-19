import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import mockChargingEvents from "../helper/mockChargingEvents";
import { numberSchema } from "../validations/simulationConfig";

const router = express.Router();
const prisma = new PrismaClient();

// 📌 Mock Simulation Endpoint
router.post("/:simulationConfigId", async (req: any, res: any) => {
  const validation = numberSchema.safeParse(req.params.simulationConfigId);

  if (!validation.success) {
    return res.status(400).json({ error: "Invalid simulation config id" });
  }

  const simulationConfigId = validation.data;

  const input = await prisma.simulationConfig.findUnique({
    where: { id: simulationConfigId },
  });

  if (!input)
    return res
      .status(404)
      .json({ error: "Simulation configuration not found" });

  // 📌 Mock Simulation Result
  const totalEnergyCharged = Math.random() * 50000;
  const maxPowerDemand = Math.random() * 120;
  const concurrencyFactor =
    maxPowerDemand / (input.chargePoints * input.chargingPower);

  const result = await prisma.simulationResult.create({
    data: {
      simulationConfigId,
      totalEnergyCharged,
      maxPowerDemand,
      concurrencyFactor,
    },
  });

  // 📌 Mock Charging Events
  const chargingEvents = mockChargingEvents(result.id);
  // NOTE: Keeping this async to avoid blocking api response
  await prisma.chargingEvent
    .createMany({
      data: chargingEvents,
    })
    .then(() => {
      console.log(
        `🔥 ${result.id} has ${chargingEvents.length} charging events`
      );
    });

  return res.json(result);
});

router.get("/", async (_req: Request, res: Response) => {
  const results = await prisma.simulationResult.findMany();
  res.json(results);
});

router.get("/:id", async (req: Request, res: Response) => {
  const result = await prisma.simulationResult.findUnique({
    where: { id: Number(req.params.id) },
  });
  result ? res.json(result) : res.status(404).json({ error: "Not found" });
});

router.get(
  "/:simulationResultId/charging-events",
  async (req: Request, res: Response) => {
    const validation = numberSchema.safeParse(req.params.simulationResultId);

    if (!validation.success) {
      res.status(400).json({ error: "Invalid simulation result id" });
      return;
    }

    const simulationResultId = validation.data;

    const chargingEvents = await prisma.chargingEvent.findMany({
      where: { simulationResultId: simulationResultId },
    });

    res.json(chargingEvents);
  }
);

export default router;
