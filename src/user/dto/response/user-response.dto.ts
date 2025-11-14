export class UserResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  id: string;
  static fromEntity(entity: any): UserResponseDto {
    const dto = new UserResponseDto();
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.email = entity.email;
    dto.createdAt = entity.createdAt;
    dto.id = entity.id;
    return dto;
  }
}
