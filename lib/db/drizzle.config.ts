import { defineConfig } from "drizzle-kit";
import path from "path";

// Safe fallback for development
const databaseUrl = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mockdb";

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
