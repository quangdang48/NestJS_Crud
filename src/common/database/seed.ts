import { PrismaService } from '../../prisma/prisma.service';
import { SeedBlog } from './seed-blog';
import { SeedCreditSystem } from './seed-credit-system';
import { SeedPlan } from './seed-plan';
import { SeedUser } from './seed-user';
async function main() {
  const prismaService = new PrismaService();
  await SeedUser.seedUserData(prismaService);
  await SeedBlog.seedBlogData(prismaService);
  await SeedPlan.seedPlanData(prismaService);
  await SeedCreditSystem.seedCreditSystem(prismaService);
  console.log('Seed data successfully');
}
main();
