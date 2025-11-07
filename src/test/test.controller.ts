import { Controller, Get, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/auth/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(['CUSTOMER'])
  @Get('customer')
  testRoleCustomer() {
    return 'Test controller customer';
  }
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(['ADMIN'])
  @Get('admin')
  testRoleAdmin() {
    return 'Test controller admin';
  }
}
