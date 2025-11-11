import { ApiProperty } from '@nestjs/swagger';
import { Blog } from '@prisma/client';

export class BlogResponseDto {
  @ApiProperty({
    description: 'ID of the blog',
    default: '1cce56f5-c769-43f2-b5af-b9f533657727',
  })
  id: string;
  @ApiProperty({
    description: 'Title of the blog',
    default: 'Sample Blog Title',
  })
  title: string;
  @ApiProperty({
    description: 'Content of the blog',
    default: 'This is a sample blog content.',
  })
  content: string;
  @ApiProperty({
    description: 'Author ID of the blog',
    default: '2a7f3e1d-8c4b-4d2e-9f3b-1e2d3c4b5a6f',
  })
  authorId: string;

  @ApiProperty({
    description: 'Creation date of the blog',
    default: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;

  static fromEntity(entity: Blog): BlogResponseDto {
    const dto = new BlogResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.content = entity.content;
    dto.authorId = entity.authorId;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
