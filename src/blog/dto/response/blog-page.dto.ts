import { PageDto } from 'src/common/dto/page.dto';
import { BlogResponseDto } from './blog-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BlogPageDto extends PageDto<BlogResponseDto> {
  @ApiProperty({ type: [BlogResponseDto] })
  readonly data: BlogResponseDto[];
}
