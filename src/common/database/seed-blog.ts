import { PrismaService } from 'src/prisma/prisma.service';

export class SeedBlog {
  public static async seedBlogData(prisma: PrismaService): Promise<void> {
    try {
      // Lấy danh sách user (trừ admin)
      const users = await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        select: { id: true },
      });

      if (users.length === 0) {
        console.log('❌ No users found to attach blogs.');
        return;
      }

      const blogs = Array.from({ length: 20 }).map((_, index) => ({
        title: `Blog Title ${index + 1}`,
        content: `This is the content of blog ${index + 1}.`,
        authorId: users[Math.floor(Math.random() * users.length)].id,
      }));

      await prisma.blog.createMany({
        data: blogs,
      });

      console.log('✅ Blog seeding completed.');
    } catch (error) {
      console.log('❌ Error when seeding blog:', error);
    }
  }
}
