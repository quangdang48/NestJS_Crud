import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../src/prisma/prisma.service';
const prisma = new PrismaClient()
const prismaService = new PrismaService();
async function main() {
  const salt = bcrypt.genSaltSync(10);
  const password = '123456';
  const hashedPassword = bcrypt.hashSync(password, salt);
  const admin = await prismaService.user.create({
    data: {
      email: 'admin@gmail.com',
      firstName: 'admin',
      lastName: 'admin',
      role: UserRole.ADMIN,
      password: hashedPassword,
      salt: salt,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })