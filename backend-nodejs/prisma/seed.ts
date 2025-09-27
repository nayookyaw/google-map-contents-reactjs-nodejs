import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fail fast if required envs are missing
function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env: ${key}`);
  return v;
}

async function main() {
  const key = process.env.GOOGLE_MAPS_API_KEY ?? 'REPLACE_ME_IN_.ENV';

  // AppConfig (ensure id = 1 exists)
  await prisma.appConfig.upsert({
    where: { id: 1 },
    update: { googleMapsApiKey: key },
    create: { id: 1, googleMapsApiKey: key },
  });

  // Locations
  await prisma.location.createMany({
    data: [
      { name: 'Sky Tower', lat: -36.8485, lng: 174.7622, description: 'Auckland icon' },
      { name: 'AUT City Campus', lat: -36.8523, lng: 174.7666, description: 'University campus' },
    ],
    skipDuplicates: true,
  });

  // Users
  await prisma.user.createMany({
    data: [
      { name: 'Alice Admin', email: 'alice@example.com', role: 'ADMIN' },
      { name: 'Evan Editor', email: 'evan@example.com', role: 'EDITOR' },
      { name: 'Vicky Viewer', email: 'vicky@example.com', role: 'VIEWER' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });