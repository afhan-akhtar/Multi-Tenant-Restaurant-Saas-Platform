import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/platform/schema.prisma",
  migrations: {
    path: "prisma/platform/migrations",
    seed: "node prisma/seed.mjs",
  },
  datasource: {
    url: process.env["PLATFORM_DATABASE_URL"] ?? process.env["DATABASE_URL"],
  },
});
