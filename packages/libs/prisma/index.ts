import { PrismaClient } from "@prisma/client";

declare global {
  var prismadb: PrismaClient | undefined;
}

const prisma = globalThis.prismadb ?? new PrismaClient({
  log: process.env.NODE_ENV === "production" 
    ? ['error'] 
    : ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prismadb = prisma;
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;