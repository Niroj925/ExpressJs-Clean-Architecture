import { AppDataSource } from "framework/data-services/pg/data-source";
import { PgDataServices } from "framework/data-services/pg/pg-data-services.service";

let pgDataServices: PgDataServices | null = null;

export async function initializeDataSource(): Promise<boolean> {
  try {
    await AppDataSource.initialize();

    // Create PgDataServices using the initialized DataSource; PgDataServices
    // will build repositories for all registered entities automatically.
    pgDataServices = new PgDataServices(AppDataSource as any);
    await pgDataServices.initialize();

    console.log("Postgres DataSource initialized and PgDataServices created");
    return true;
  } catch (err: any) {
    console.error("Failed to initialize Postgres DataSource:", err?.message ?? err);
    // Do not throw here if you prefer to run with in-memory fallback; rethrow if you want startup to fail
    pgDataServices = null;
    return false;
  }
}

export function getDataServices(): PgDataServices {
  if (!pgDataServices) {
    throw new Error("PgDataServices is not initialized. Call initDataServices() first.");
  }
  return pgDataServices;
}


export default initializeDataSource;
