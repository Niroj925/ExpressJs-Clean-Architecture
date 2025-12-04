// Import packages onto app
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

dotenv.config();

import { initializeDataSource } from "common/config/datasource";
import { setupSwagger } from "swagger";

const PORT = process.env.PORT || 4040;
const RATE_TIME_LIMIT = Number(process.env.RATE_TIME_LIMIT) || 15;
const RATE_REQUEST_LIMIT = Number(process.env.RATE_REQUEST_LIMIT) || 100;

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: RATE_TIME_LIMIT * 60 * 1000,
    max: RATE_REQUEST_LIMIT,
  }),
);

app.use(cors());

app.use(helmet());

app.use(hpp());


// Initialize data source first, then import routes so routers can use DB services
(async () => {
  try {
    const initialized = await initializeDataSource();
    if (initialized) {
      console.log("Data Source has been initialized!");
    } else {
      console.log("Data Source not initialized; running with in-memory services");
    }

    const routes = (await import("./presentation/router/index")).default;

    app.use("/api", routes);

    setupSwagger(app);
    
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
})();
