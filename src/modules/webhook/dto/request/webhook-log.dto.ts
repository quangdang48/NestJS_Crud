import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateWebhookLogRequest {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsNotEmpty()
  payload: any;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  receivedAt: string;
}
