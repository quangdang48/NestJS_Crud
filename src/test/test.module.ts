import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [BlogModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
