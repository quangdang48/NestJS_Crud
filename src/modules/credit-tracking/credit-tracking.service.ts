import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCreditTrackingDto } from './dto/request/create-credit-tracking.dto';
import { CREDIT_TRACKING_TYPE } from '@prisma/client';

@Injectable()
export class CreditTrackingService {
  constructor(private readonly prismaService: PrismaService) {}

  async consumeCredit(dto: CreateCreditTrackingDto) {
    // Validate user exists
    const user = await this.prismaService.user.findFirst({
      where: { id: dto.userId, isActive: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get credit system config
    const creditSystem = await this.prismaService.creditSystem.findFirst({
      where: { type: dto.creditSystemType, isActive: true },
    });
    if (!creditSystem) {
      throw new NotFoundException('Credit system not found');
    }

    const creditCost = creditSystem.amount;
    const currentBalance = await this.getCreditBalance(dto.userId);

    // Check sufficient credit
    if (creditCost > currentBalance.balance) {
      throw new BadRequestException(
        `Insufficient credit. Required: ${creditCost}, Available: ${currentBalance.balance}`,
      );
    }

    // Create consume record with PENDING status
    const createdCreditTracking =
      await this.prismaService.creditTracking.create({
        data: {
          userId: dto.userId,
          type: 'CONSUME',
          amount: creditCost,
          creditSystemType: dto.creditSystemType,
          currency: 'usd',
          status: 'PENDING',
        },
      });

    return {
      id: createdCreditTracking.id,
      message: 'Credit tracking created, waiting for confirmation',
      status: 'PENDING',
      consumed: creditCost,
      remainingBalance: currentBalance.balance - creditCost,
    };
  }

  async createCreditTracking(dto: CreateCreditTrackingDto) {
    return this.consumeCredit(dto);
  }

  async getCreditBalance(userId: string) {
    const breakdown = await this.getCreditBreakdown(userId);
    const balance =
      breakdown.initial +
      breakdown.granted +
      breakdown.renewed -
      breakdown.consumed;
    return { balance, breakdown };
  }

  private async getCreditBreakdown(userId: string) {
    const [initial, granted, renewed, consumed] = await Promise.all([
      this.aggregateByType(userId, 'INITIAL_SUBSCRIPTION'),
      this.aggregateByType(userId, 'GRANT'),
      this.aggregateByType(userId, 'RENEW_SUBSCRIPTION'),
      this.aggregateByType(userId, 'CONSUME'),
    ]);

    return { initial, granted, renewed, consumed };
  }

  private async aggregateByType(
    userId: string,
    type: CREDIT_TRACKING_TYPE,
  ): Promise<number> {
    const result = await this.prismaService.creditTracking.aggregate({
      where: { userId, type, status: { in: ['COMPLETED', 'PENDING'] } },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async confirmCreditTracking(creditTrackingId: string) {
    const creditTracking = await this.prismaService.creditTracking.findFirst({
      where: { id: creditTrackingId, isActive: true },
    });

    if (!creditTracking) {
      throw new NotFoundException('Credit tracking not found');
    }

    if (creditTracking.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot confirm credit tracking with status: ${creditTracking.status}`,
      );
    }

    const updated = await this.prismaService.creditTracking.update({
      where: { id: creditTrackingId },
      data: { status: 'COMPLETED' },
    });

    return {
      id: updated.id,
      message: 'Credit tracking confirmed successfully',
      status: updated.status,
    };
  }
}
