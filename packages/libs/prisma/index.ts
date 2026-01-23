// @ts-ignore - Prisma 7 type definitions may have issues
import { PrismaClient } from "@prisma/client";

declare global {
  // For TypeScript global augmentation
  var prismadb: PrismaClient | undefined;
}

// Prisma 7 reads the connection from prisma.config.ts automatically
const prisma = new PrismaClient();

if (process.env.NODE_ENV === "production") {
  globalThis.prismadb = prisma;
}

export default prisma;
