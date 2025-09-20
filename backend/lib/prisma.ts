import { PrismaClient } from "@prisma/client";
export type { Condition } from "@prisma/client";

// Use globalThis which is available in all JS runtimes and recognized by TS
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

// Guard access to process.env via globalThis to avoid needing @types/node
const nodeEnv = (globalThis as any)?.process?.env?.NODE_ENV as string | undefined;

if (nodeEnv !== "production") { globalForPrisma.prisma = prisma;}