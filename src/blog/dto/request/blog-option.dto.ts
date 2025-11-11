import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dto';

export class BlogOptionDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Search by title of blog',
    example: 'Blog Title 1',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;
}
