import { PrismaService } from '../../prisma/prisma.service';
import { SeedBlog } from './seed-blog';
import { SeedUser } from './seed-user';
async function main() {
  const prismaService = new PrismaService();
  await SeedUser.seedUserData(prismaService);
  await SeedBlog.seedBlogData(prismaService);
  console.log('Seed data successfully');
}
main();
