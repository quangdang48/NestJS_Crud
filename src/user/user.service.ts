import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import * as Papa from 'papaparse';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/response/user-response.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma, UserRole } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import {
  FailedImport,
  ImportUserResponseDto,
  ReasonFailed,
} from './dto/response/import-file-response.dto';
import { UserOptionDto } from './dto/request/user-option';
import { Order } from 'src/common/dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async importUserInformation(
    file: Express.Multer.File,
  ): Promise<ImportUserResponseDto> {
    if (!file || !file.buffer) {
      throw new Error('File buffer is empty!');
    }

    const csvString = file.buffer.toString('utf-8');

    const results: Papa.ParseResult<CreateUserDto> = Papa.parse(csvString, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    });

    const users = results.data;
    const imported: string[] = [];
    const failed: FailedImport[] = [];

    for (let i = 0; i < users.length; i++) {
      try {
        const userData = users[i];

        if (!userData || Object.keys(userData).length === 0) {
          continue;
        }

        const userDto = plainToClass(CreateUserDto, userData);
        const errors: ValidationError[] = await validate(userDto);
        if (errors.length > 0) {
          const failedImport: FailedImport =
            this.getFailedImportFromValidationError(i + 1, errors);
          failed.push(failedImport);
          continue;
        }
        const userExists = await this.prismaService.user.findFirst({
          where: { email: userDto.email, isActive: true },
        });
        if (userExists) {
          failed.push({
            row: i + 1,
            descriptions: [
              {
                property: 'email',
                reason: [`User with email ${userDto.email} already exists`],
              },
            ],
          });
          continue;
        }
        const result: { salt: string; hashedPassword: string } =
          this.hashedPassword(userDto.password);

        const createdUser = await this.prismaService.user.create({
          data: {
            email: userDto.email,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            password: result.hashedPassword,
            salt: result.salt,
            role: UserRole.CUSTOMER,
          },
        });

        if (createdUser) {
          imported.push(userDto.email);
        }
      } catch (error) {
        console.error('Import error at row', i + 1, ':', error.message);
        failed.push({
          row: i + 1,
          descriptions: [
            {
              property: 'error',
              reason: [error.message],
            },
          ],
        });
      }
    }

    return {
      message: `Import completed! Imported: ${imported.length}, Failed: ${failed.length}`,
      imported: imported,
      failed: failed,
    };
  }
  getFailedImportFromValidationError(
    row: number,
    errors: ValidationError[],
  ): FailedImport {
    const reasonFailed: ReasonFailed[] = [];
    errors.forEach((error) => {
      const constraints = error.constraints;
      const propertiesError = error.property;
      if (constraints) {
        const reasons = Object.values(constraints);
        reasonFailed.push({
          property: propertiesError,
          reason: reasons,
        });
      }
    });
    return {
      row: row,
      descriptions: reasonFailed,
    };
  }
  hashedPassword(password: string): { salt: string; hashedPassword: string } {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return { salt, hashedPassword };
  }
  async exportAllUserInformation(
    userOptionDto: UserOptionDto,
  ): Promise<string> {
    const where = {
      email: userOptionDto.email,
      isActive: true,
      role: UserRole.CUSTOMER,
      ...(userOptionDto.firstName
        ? {
            firstName: {
              contains: userOptionDto.firstName,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {}),
      ...(userOptionDto.lastName
        ? {
            lastName: {
              contains: userOptionDto.lastName,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {}),
    };
    const orderBy: Prisma.BlogOrderByWithRelationInput = {
      createdAt: userOptionDto.order === Order.ASC ? 'asc' : 'desc',
    };
    const [users, totalCount] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        orderBy,
        skip: userOptionDto.skip,
        take: userOptionDto.pageSize,
      }),
      this.prismaService.user.count({ where }),
    ]);
    const userData = users.map((user) => UserResponseDto.fromEntity(user));

    if (totalCount === 0) {
      return 'Can not export any user data as no user matches the criteria.';
    }

    const csv = Papa.unparse(userData, {
      header: true,
      delimiter: ';',
    });
    return csv;
  }
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany({
      where: { isActive: true, role: UserRole.CUSTOMER },
    });
    return users.map((user) => UserResponseDto.fromEntity(user));
  }
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.prismaService.user.findFirst({
      where: { email: createUserDto.email, isActive: true },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);
    const user = await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        password: hashedPassword,
        salt: salt,
      },
    });
    return UserResponseDto.fromEntity(user);
  }
}
