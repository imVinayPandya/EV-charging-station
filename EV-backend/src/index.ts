import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { simulationConfig, simulation } from "./routes";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/api/simulation/config", simulationConfig);
app.use("/api/simulation", simulation);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
