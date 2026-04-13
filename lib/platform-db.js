import { PrismaClient } from "../generated/prisma-platform/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function createPlatformPrisma() {
  const connectionString =
    process.env.PLATFORM_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "PLATFORM_DATABASE_URL (or DATABASE_URL) must be set for the platform database."
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const platformPrisma =
  globalForPrisma.platformPrisma ?? createPlatformPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.platformPrisma = platformPrisma;
}
