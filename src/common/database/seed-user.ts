import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
export class SeedUser {
  public static async seedUserData(
    prismaService: PrismaService,
  ): Promise<void> {
    const salt = bcrypt.genSaltSync(10);
    const password = '12345678';
    const hashedPassword = bcrypt.hashSync(password, salt);
    const users = Array.from({ length: 10 }).map((_, index) => ({
      email: `user${index + 1}@gmail.com`,
      firstName: `User${index + 1}`,
      lastName: `Test${index + 1}`,
      role: UserRole.CUSTOMER,
      password: hashedPassword,
      salt: salt,
    }));
    try {
      await prismaService.user.create({
        data: {
          email: 'admin@gmail.com',
          firstName: 'admin',
          lastName: 'admin',
          role: UserRole.ADMIN,
          password: hashedPassword,
          salt: salt,
        },
      });
      await prismaService.user.createMany({
        data: users,
        skipDuplicates: true,
      });
      console.log('Seeding user data completed.');
    } catch (error) {
      console.log('Error when seeding user:' + error);
    }
  }
}
