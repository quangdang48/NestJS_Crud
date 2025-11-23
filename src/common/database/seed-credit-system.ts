import { CREDIT_SYSTEM_TYPE } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class SeedCreditSystem {
  public static async seedCreditSystem(prisma: PrismaService): Promise<any> {
    const data = [
      {
        id: '01KAFHFHPRMRQ3QGTNZR36W169',
        name: 'Aut',
        type: CREDIT_SYSTEM_TYPE.AI_BLOG_GEN,
        description: 'Credits used for gen content for blog.',
        defaultCredit: 10,
      },
      {
        id: '01KAFHFHPS2RWPNTG00DDZQE3Q',
        name: 'Image Generation Credits',
        type: CREDIT_SYSTEM_TYPE.BLOG_SUMMARY,
        description: 'Credits used for log summary.',
        defaultCredit: 5,
      },
    ];

    await prisma.creditSystem.createMany({
      data,
      skipDuplicates: true,
    });

    console.log('Seeded CreditSystem successfully!');
  }
}
