import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Safe fallback for development - use mock connection if DATABASE_URL is missing
const databaseUrl = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mockdb";

// Create pool with error handling
let pool: pg.Pool;
let db: ReturnType<typeof drizzle>;

try {
  pool = new Pool({ 
    connectionString: databaseUrl,
    // Add connection timeout and retry settings
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
  db = drizzle(pool, { schema });
} catch (error) {
  console.warn('⚠️ Failed to create database pool, using mock connection:', error);
  // Create a mock pool that doesn't crash
  pool = new Pool({ 
    connectionString: "postgresql://mock:mock@localhost:5432/mockdb" 
  });
  db = drizzle(pool, { schema });
}

export { pool, db };
export * from "./schema";
