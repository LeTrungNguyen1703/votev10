import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

async function main() {
  const url = process.env.DATABASE_URL;
  console.log('Using DATABASE_URL:', url);
  const prisma = new PrismaClient({
    datasources: { db: { url } },
    log: ['query', 'info', 'warn', 'error'],
  });
  try {
    await prisma.$connect();
    console.log('Connected to DB');
    const res = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('Query result:', res);
    const users = await prisma.user.findMany();
    console.log('Existing users count:', Array.isArray(users) ? users.length : users);
  } catch (err) {
    console.error('Prisma test failed:', err);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}

main();

