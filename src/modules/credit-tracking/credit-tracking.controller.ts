import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCreditTrackingDto } from './dto/request/create-credit-tracking.dto';
import { CreditTrackingService } from './credit-tracking.service';

@ApiTags('Credit Tracking')
@Controller('credit-tracking')
export class CreditTrackingController {
  constructor(private readonly creditTrackingService: CreditTrackingService) {}

  @Post('consume')
  @ApiOperation({
    summary: 'Consume credit',
    description:
      'Deduct credit from user balance when using a feature (AI_BLOG_GEN, BLOG_SUMMARY, TEXT_TRANSLATION, etc.)',
  })
  @ApiBody({ type: CreateCreditTrackingDto })
  @ApiResponse({
    status: 200,
    description: 'Credit consumed successfully',
    schema: {
      example: {
        id: '01ABC123',
        message: 'Credit tracking created, waiting for confirmation',
        status: 'PENDING',
        consumed: 1,
        remainingBalance: 99,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Insufficient credit' })
  @ApiResponse({ status: 404, description: 'User or Credit system not found' })
  async consumeCredit(@Body() dto: CreateCreditTrackingDto) {
    return this.creditTrackingService.consumeCredit(dto);
  }

  @Post('confirm/:id')
  @ApiOperation({
    summary: 'Confirm credit tracking',
    description: 'Confirm a pending credit tracking (PENDING -> COMPLETED)',
  })
  @ApiParam({ name: 'id', description: 'Credit Tracking ID' })
  @ApiResponse({
    status: 200,
    description: 'Credit tracking confirmed',
    schema: {
      example: {
        id: '01ABC123',
        message: 'Credit tracking confirmed successfully',
        status: 'COMPLETED',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid status for confirmation' })
  @ApiResponse({ status: 404, description: 'Credit tracking not found' })
  async confirmCreditTracking(@Param('id') id: string) {
    return this.creditTrackingService.confirmCreditTracking(id);
  }
}
