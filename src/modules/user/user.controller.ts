import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Express } from 'express';
import { UserOptionDto } from './dto/request/user-option';
import { ImportUserResponseDto } from './dto/response/import-file-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('export')
  @ApiOperation({ summary: 'Export all users to CSV file' })
  @ApiResponse({
    status: 200,
    description: 'CSV file of all users is returned',
    content: {
      'text/csv': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @Roles(['ADMIN'])
  async exportUsers(
    @Res() res,
    @Query() userOption: UserOptionDto,
  ): Promise<void> {
    const csvUsers =
      await this.userService.exportAllUserInformation(userOption);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csvUsers);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Import users from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'CSV file imported successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  @Roles(['ADMIN'])
  async importUsers(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1MB
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<ImportUserResponseDto> {
    if (!file.mimetype.includes('csv') && file.mimetype !== 'text/plain') {
      throw new BadRequestException('Only CSV files are allowed');
    }
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must have .csv extension');
    }
    return await this.userService.importUserInformation(file);
  }
}
