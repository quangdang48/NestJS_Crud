import { PrismaService } from '../../prisma/prisma.service';
import { BILLING_CYCLE, PLAN_TYPE } from '@prisma/client';

export class SeedPlan {
  public static async seedPlanData(prisma: PrismaService): Promise<void> {
    try {
      const plans = [
        {
          id: '01KAFH089KHC8Y475BZMB8AY62',
          name: 'TRIAL_PACKAGE',
          description: 'Free trial package for new users',
          price: 0,
          durationDays: 7,
          stripeProductId: 'prod_TSHpVJ4N3yJHkT',
          stripePriceId: 'price_1SVNFO2caDcXa36zUZCgVdSV',
          isDisplay: true,
          isTrial: true,
          trialDays: 7,
          creditLimits: 500,
          billingCycle: BILLING_CYCLE.WEEKLY,
          planType: PLAN_TYPE.FREE,
        },
        {
          id: '01KAFH089KYRQ5WTK1051XS0MS',
          name: 'PRO_MONTHLY',
          description: 'Monthly subscription with full features',
          price: 9.99,
          durationDays: 30,
          stripeProductId: 'prod_TSHpiG3S06BSW0',
          stripePriceId: 'price_1SVNFm2caDcXa36zvFkeJDgQ',
          isDisplay: true,
          isTrial: false,
          creditLimits: 1000,
          billingCycle: BILLING_CYCLE.MONTHLY,
          planType: PLAN_TYPE.PRO,
        },
        {
          id: '01KAFH089KSFHT6WTJ753S6WWT',
          name: 'PRO_YEARLY',
          description: 'Yearly subscription with discounted price',
          price: 99.99,
          durationDays: 365,
          stripeProductId: 'prod_TSHpYtNqm1bADq',
          stripePriceId: 'price_1SVNGG2caDcXa36zjDolrCp7',
          isDisplay: true,
          isTrial: false,
          trialDays: null,
          creditLimits: 1500,
          billingCycle: BILLING_CYCLE.YEARLY,
          planType: PLAN_TYPE.PRO,
        },
      ];

      await prisma.plan.createMany({
        data: plans,
        skipDuplicates: true,
      });

      console.log('Seeding plan data completed.');
    } catch (error) {
      console.log('Error seeding plan:', error);
    }
  }
}
