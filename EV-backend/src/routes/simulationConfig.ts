import Router from "express-promise-router";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { simulationConfigSchema } from "../validations";
import { numberSchema } from "../validations/simulationConfig";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  const validation = simulationConfigSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json(validation.error);

  const input = await prisma.simulationConfig.create({
    data: validation.data,
  });

  return res.status(201).json(input);
});

router.get("/", async (_req: Request, res: Response) => {
  const inputs = await prisma.simulationConfig.findMany();
  return res.json(inputs);
});

router.get("/:id", async (req: Request, res: Response) => {
  const input = await prisma.simulationConfig.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!input) return res.status(404).json({ error: "Not found" });

  return res.json(input);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const validation = numberSchema.safeParse(req.params.id);
  if (!validation.success) {
    return res.status(400).json(validation.error);
  }

  const simulationResult = await prisma.simulationResult.findFirst({
    where: { simulationConfigId: validation.data },
  });

  // 📌 Cascade Delete
  if (simulationResult) {
    await prisma.chargingEvent.deleteMany({
      where: { simulationResultId: simulationResult.id },
    });

    await prisma.simulationResult.deleteMany({
      where: { simulationConfigId: validation.data },
    });
  }

  await prisma.simulationConfig.delete({
    where: { id: validation.data },
  });

  return res.status(204).send();
});

export default router;
