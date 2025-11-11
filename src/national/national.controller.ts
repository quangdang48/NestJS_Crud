import { Controller, Get, Param } from '@nestjs/common';
import { NationalService } from './national.service';
import { NationalResponse } from './dto/response/national-response';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('national')
export class NationalController {
  constructor(private readonly nationalService: NationalService) {}
  @Get(':name')
  @ApiOperation({ summary: 'Get national data by name' })
  @ApiResponse({
    status: 200,
    description: 'The national data has been successfully retrieved.',
    type: NationalResponse,
  })
  getNationalByName(@Param('name') name: string): Promise<NationalResponse> {
    return this.nationalService.getNationalByName(name);
  }
}
