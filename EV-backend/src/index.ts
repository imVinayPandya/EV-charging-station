import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { simulationConfig, simulation } from "./routes";
import logger, { expressLogger } from "./utils/logger";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// health check
app.get("/", (_req: Request, res: Response) => {
  logger.info("Health check");
  return res.status(200).send({ message: "Server is running" });
});

app.use("/api/simulation/config", simulationConfig);
app.use("/api/simulation", simulation);

// catch 404 and forward to error handler
app.use((_req: Request, res: Response) => {
  logger.error("Requested Url Not found");
  return res.status(404).send({ message: "Requested Url Not found" });
});

// error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Global error handler triggered");
  logger.error(err);

  // prisma error (it should in separate file or middleware)
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).send({ error: "Not found" });
    }
    if (err.code === "P2003") {
      return res.status(400).send({ error: "Bad request" });
    }
  }

  return res
    .status(500)
    .send({ message: err.message || "Internal Server Error" });
});

app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
