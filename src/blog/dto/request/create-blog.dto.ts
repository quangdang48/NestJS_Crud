import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBlogRequestDto {
  @ApiProperty({
    description: 'Title of the blog',
    default: 'title',
    nullable: false,
    minLength: 5,
    maxLength: 100,
  })
  @MinLength(5)
  @MaxLength(100)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the blog',
    default: 'content',
    nullable: false,
    minLength: 5,
    maxLength: 1000,
  })
  content: string;
}
