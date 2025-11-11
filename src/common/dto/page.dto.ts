import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ description: 'Total records', example: '10' })
  readonly total: number;

  @ApiProperty({ description: 'Page number', example: '1' })
  readonly pageNumber: number;

  @ApiProperty({ description: 'Page size', example: '10' })
  readonly pageSize: number;

  @ApiProperty({ description: 'Total page', example: '1' })
  readonly totalPages: number;

  constructor(data: T[], total: number, pageNumber: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}
