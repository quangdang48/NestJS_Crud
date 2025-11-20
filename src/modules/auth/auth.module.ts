import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Global, Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
