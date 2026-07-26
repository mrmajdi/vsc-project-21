import { PrismaClient } from '@prisma/client';

// Prisma client is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
  });
} else {
  // In development, use a global variable to preserve the Prisma Client instance
  // across hot reloads.
  // @ts-ignore
  if (!global.__prisma) {
    // @ts-ignore
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  // @ts-ignore
  prisma = global.__prisma;
}

export default prisma;