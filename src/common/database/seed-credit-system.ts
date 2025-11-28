import { PrismaClient, CREDIT_SYSTEM_TYPE } from '@prisma/client';

export class SeedCreditSystem {
  static async seedCreditSystem(prisma: PrismaClient) {
    const creditSystems = [
      {
        name: 'AI Blog Generation',
        type: CREDIT_SYSTEM_TYPE.AI_BLOG_GEN,
        description:
          'Credits used for AI-powered blog content generation. Each credit allows generating one blog post with AI assistance.',
        amount: 50,
      },
      {
        name: 'Blog Summary',
        type: CREDIT_SYSTEM_TYPE.BLOG_SUMMARY,
        description:
          'Credits used for generating blog summaries. Each credit allows summarizing one blog post into a concise overview.',
        amount: 100,
      },
      {
        name: 'Text Translation',
        type: CREDIT_SYSTEM_TYPE.TEXT_TRANSLATION,
        description:
          'Credits used for translating text between languages. Each credit allows translating up to 1000 characters.',
        amount: 200,
      },
      {
        name: 'Text Rewrite',
        type: CREDIT_SYSTEM_TYPE.TEXT_REWRITE,
        description:
          'Credits used for rewriting and paraphrasing text. Each credit allows rewriting up to 500 characters.',
        amount: 150,
      },
      {
        name: 'Grammar Check',
        type: CREDIT_SYSTEM_TYPE.GRAMMAR_CHECK,
        description:
          'Credits used for checking grammar and spelling. Each credit allows checking up to 2000 characters.',
        amount: 300,
      },
      {
        name: 'Image Storage',
        type: CREDIT_SYSTEM_TYPE.IMAGE_STORAGE,
        description:
          'Credits used for storing images. Each credit allows storing one image up to 10MB.',
        amount: 100,
      },
    ];

    await prisma.creditSystem.createMany({
      data: creditSystems,
      skipDuplicates: true,
    });

    return creditSystems;
  }
}
