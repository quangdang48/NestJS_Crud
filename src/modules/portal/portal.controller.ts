import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { PortalService } from './portal.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { BillingPortalResponse } from './dto/billing-portal-response.dto';
import { BILLING_PORTAL_TYPE } from '@prisma/client';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';

@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @ApiProperty({
    description: 'Get Billing Portal URL',
    type: BillingPortalResponse,
  })
  @ApiQuery({
    name: 'portal',
    enum: BILLING_PORTAL_TYPE,
    description: 'Type of billing portal to access',
    required: true,
  })
  @Get('billing')
  @UseGuards(AuthGuard)
  async getBillingPortal(
    @Req() req: Request,
    @Query('portal') portalType: BILLING_PORTAL_TYPE,
  ): Promise<BillingPortalResponse> {
    const userId = req.user.userId;
    return this.portalService.getBillingPortalUrl(userId, portalType);
  }
}
