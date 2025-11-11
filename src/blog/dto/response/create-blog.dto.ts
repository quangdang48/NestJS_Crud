export class CreateBlogResponseDto {
  id: string;
  title: string;
  content: string;
  authorId: string;
  path: string;
  static fromEntity(entity: any): CreateBlogResponseDto {
    const dto = new CreateBlogResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.content = entity.content;
    dto.authorId = entity.authorId;
    return dto;
  }
}
