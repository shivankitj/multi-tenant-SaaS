// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create or update Tenants
  const tenantAcme = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme Inc.',
      slug: 'acme',
    },
  });

  const tenantGlobex = await prisma.tenant.upsert({
    where: { slug: 'globex' },
    update: {},
    create: {
      name: 'Globex Corp.',
      slug: 'globex',
    },
  });

  // 2. Create Subscriptions for each tenant (default is Free)
  await prisma.subscription.upsert({
    where: { tenantId: tenantAcme.id },
    update: {},
    create: {
      tenantId: tenantAcme.id,
      planType: 'Free',
    },
  });

  await prisma.subscription.upsert({
    where: { tenantId: tenantGlobex.id },
    update: {},
    create: {
      tenantId: tenantGlobex.id,
      planType: 'Free',
    },
  });

  // 3. Hash the default password
  const hashedPassword = await bcrypt.hash('password', 12);

  // 4. Create Users for Acme
  await prisma.user.upsert({
    where: { email: 'admin@acme.test' },
    update: {},
    create: {
      email: 'admin@acme.test',
      password: hashedPassword,
      role: 'Admin',
      tenantId: tenantAcme.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@acme.test' },
    update: {},
    create: {
      email: 'user@acme.test',
      password: hashedPassword,
      role: 'Member',
      tenantId: tenantAcme.id,
    },
  });

  // 5. Create Users for Globex
  await prisma.user.upsert({
    where: { email: 'admin@globex.test' },
    update: {},
    create: {
      email: 'admin@globex.test',
      password: hashedPassword,
      role: 'Admin',
      tenantId: tenantGlobex.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@globex.test' },
    update: {},
    create: {
      email: 'user@globex.test',
      password: hashedPassword,
      role: 'Member',
      tenantId: tenantGlobex.id,
    },
  });

  console.log('Seeding finished. Test accounts:');
  console.log('Admin: admin@acme.test / password');
  console.log('Member: user@acme.test / password');
  console.log('Admin: admin@globex.test / password');
  console.log('Member: user@globex.test / password');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });