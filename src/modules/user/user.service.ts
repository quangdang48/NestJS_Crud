import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import * as Papa from 'papaparse';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/response/user-response.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma, UserRole } from '@prisma/client';
import {
  ErrorCodeImportUser,
  ErrorMessageMap,
  FailedField,
  FailedImport,
  ImportUserResponseDto,
} from './dto/response/import-file-response.dto';
import { UserOptionDto } from './dto/request/user-option';
import { Order } from 'src/common/dto';
import { ImportUserDto } from './dto/request/import-user.dto';

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
    const results: Papa.ParseResult<ImportUserDto> = Papa.parse(csvString, {
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
        const mappedData: CreateUserDto = {
          firstName: userData['First Name'] || '',
          lastName: userData['Last Name'] || '',
          email: userData['Email'] || '',
          password: userData['Password'] || '',
        };
        const basicValidation = this.validateBasicUserData(mappedData);
        if (basicValidation.length > 0) {
          failed.push({
            row: i + 1,
            email: mappedData.email,
            descriptions: basicValidation,
          });
          continue;
        }
        const userExists = await this.prismaService.user.findFirst({
          where: { email: mappedData.email, isActive: true },
        });

        const result: { salt: string; hashedPassword: string } =
          this.hashedPassword(mappedData.password);

        if (userExists) {
          const updatedUser = await this.prismaService.user.update({
            where: { id: userExists.id },
            data: {
              firstName: mappedData.firstName,
              lastName: mappedData.lastName,
            },
          });

          if (updatedUser) {
            imported.push(`${mappedData.email} (updated)`);
          }
        } else {
          const createdUser = await this.prismaService.user.create({
            data: {
              email: mappedData.email,
              firstName: mappedData.firstName,
              lastName: mappedData.lastName,
              password: result.hashedPassword,
              salt: result.salt,
              role: UserRole.CUSTOMER,
            },
          });

          if (createdUser) {
            imported.push(`${mappedData.email} (created)`);
          }
        }
      } catch (error) {
        console.error('Import error at row', i + 1, ':', error.message);
        failed.push({
          row: i + 1,
          descriptions: [
            {
              property: 'error',
              reason: [ErrorMessageMap[ErrorCodeImportUser.DATABASE_ERROR]],
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
  validateBasicUserData(userData: CreateUserDto): FailedField[] {
    const reasons: FailedField[] = [];
    // Validate firstName
    if (!userData.firstName || userData.firstName.trim() === '') {
      reasons.push({
        property: 'firstName',
        reason: [ErrorMessageMap[ErrorCodeImportUser.FIRST_NAME_INVALID]],
      });
    } else if (
      userData.firstName.length < 2 ||
      userData.firstName.length > 30
    ) {
      reasons.push({
        property: 'firstName',
        reason: [ErrorMessageMap[ErrorCodeImportUser.FIRST_NAME_INVALID]],
      });
    }

    // Validate lastName
    if (!userData.lastName || userData.lastName.trim() === '') {
      reasons.push({
        property: 'lastName',
        reason: [ErrorMessageMap[ErrorCodeImportUser.LAST_NAME_REQUIRED]],
      });
    } else if (userData.lastName.length < 2 || userData.lastName.length > 30) {
      reasons.push({
        property: 'lastName',
        reason: [ErrorMessageMap[ErrorCodeImportUser.LAST_NAME_INVALID]],
      });
    }

    // Validate email
    if (!userData.email || userData.email.trim() === '') {
      reasons.push({
        property: 'email',
        reason: [ErrorMessageMap[ErrorCodeImportUser.EMAIL_REQUIRED]],
      });
    } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      reasons.push({
        property: 'email',
        reason: [ErrorMessageMap[ErrorCodeImportUser.EMAIL_INVALID]],
      });
    }

    // Validate password
    if (!userData.password || userData.password.trim() === '') {
      reasons.push({
        property: 'password',
        reason: [ErrorMessageMap[ErrorCodeImportUser.PASSWORD_REQUIRED]],
      });
    } else if (userData.password.length < 8) {
      reasons.push({
        property: 'password',
        reason: [ErrorMessageMap[ErrorCodeImportUser.PASSWORD_TOO_SHORT]],
      });
    } else if (userData.password.length > 20) {
      reasons.push({
        property: 'password',
        reason: [ErrorMessageMap[ErrorCodeImportUser.PASSWORD_TOO_LONG]],
      });
    }

    return reasons;
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
      ...(userOptionDto.email
        ? {
            email: {
              contains: userOptionDto.email,
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
    if (totalCount === 0) {
      return 'Can not export any user data as no user matches the criteria.';
    }
    const userDataForCsv = users.map((user, idx) => ({
      No: idx + 1,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      Email: user.email,
      'Registered At': user.createdAt
        ? new Date(user.createdAt).toLocaleString('vi-VN')
        : '',
      Password: '',
      Role: user.role,
    }));

    const csv = Papa.unparse(userDataForCsv, {
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
