import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
