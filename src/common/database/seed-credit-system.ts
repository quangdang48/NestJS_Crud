import { CREDIT_SYSTEM_TYPE } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class SeedCreditSystem {
  public static async seedCreditSystem(prisma: PrismaService): Promise<any> {
    const data = [
      {
        id: '01KAFHFHPRMRQ3QGTNZR36W169',
        name: 'AI Chat Credits',
        type: CREDIT_SYSTEM_TYPE.AI_CHAT,
        description: 'Credits used for AI chat usage.',
        defaultCredit: 10,
      },
      {
        id: '01KAFHFHPS2RWPNTG00DDZQE3Q',
        name: 'Image Generation Credits',
        type: CREDIT_SYSTEM_TYPE.IMAGE_GEN,
        description: 'Credits used for image generation.',
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
