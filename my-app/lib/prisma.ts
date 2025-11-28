import { PrismaClient } from "@prisma/client";

declare global {
  // allow global prisma variable in development to avoid creating multiple clients during hot reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;