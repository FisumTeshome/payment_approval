import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: { email: 'superadmin@example.com', password, role: 'SUPER_ADMIN' }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', password, role: 'ADMIN' }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { email: 'user@example.com', password, role: 'USER' }
  });

  await prisma.paymentRequest.createMany({
    data: [
      { amount: 100.00, userId: user.id },
      { amount: 250.50, userId: user.id }
    ]
  });

  console.log({ superAdmin, admin, user });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
