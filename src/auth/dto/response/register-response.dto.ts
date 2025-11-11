import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;

  static fromEntity(entity: any): RegisterResponseDto {
    const dto = new RegisterResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    return dto;
  }
}
