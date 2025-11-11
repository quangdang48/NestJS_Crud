import { Module } from '@nestjs/common';
import { NationalService } from './national.service';
import { NationalController } from './national.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [NationalController],
  providers: [NationalService],
})
export class NationalModule {}
