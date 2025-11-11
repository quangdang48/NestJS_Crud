import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { UserRole } from '@prisma/client';

import { BlogService } from './blog.service';
import { CreateBlogRequestDto } from './dto/request/create-blog.dto';
import { CreateBlogResponseDto } from './dto/response/create-blog.dto';
import { BlogResponseDto } from './dto/response/blog-response.dto';
import { BlogPageDto } from './dto/response/blog-page.dto';
import { BlogOptionDto } from './dto/request/blog-option.dto';

@ApiTags('Blogs')
@Controller('blogs')
@UseGuards(AuthGuard, RolesGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  /**
   * Get blogs of logged-in user (supports pagination & search)
   */
  @Get('user')
  @Roles([UserRole.ADMIN, UserRole.CUSTOMER])
  @ApiOperation({
    summary: 'Get blogs of current user with pagination & search',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated blogs of user',
    type: BlogPageDto,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by blog title',
    type: String,
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Order ASC/DESC',
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  getBlogsOfUser(
    @Query() blogOptionsDto: BlogOptionDto,
    @Req() request: Request,
  ): Promise<BlogPageDto> {
    return this.blogService.getBlogsOfUser(blogOptionsDto, request.user.userId);
  }

  /**
   * Get blog by ID
   */
  @Get(':blogId')
  @Roles([UserRole.ADMIN, UserRole.CUSTOMER])
  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog found',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  getBlogByID(
    @Param('blogId', ParseUUIDPipe) id: string,
  ): Promise<BlogResponseDto> {
    return this.blogService.getBlogById(id);
  }

  /**
   * Create new blog
   */
  @Post()
  @Roles([UserRole.ADMIN, UserRole.CUSTOMER])
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({
    status: 200,
    description: 'Created blog',
    type: CreateBlogResponseDto,
  })
  createNewBlog(
    @Body() newBlog: CreateBlogRequestDto,
    @Req() req: Request,
  ): Promise<CreateBlogResponseDto> {
    newBlog.authorId = req.user.userId;
    return this.blogService.createBlog(newBlog);
  }

  /**
   * Delete a blog by ID
   */
  @Delete(':blogId')
  @Roles([UserRole.ADMIN, UserRole.CUSTOMER])
  @ApiOperation({ summary: 'Delete a blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog deleted successfully',
    schema: { example: { message: 'Blog deleted successfully' } },
  })
  @ApiResponse({ status: 404, description: 'Blog not found or not owner' })
  deleteBlog(
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    return this.blogService.deleteBlog(blogId, req.user.userId);
  }

  /**
   * Get blogs by Author ID
   */
  @Get('author/:authorId')
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Get blogs by author ID' })
  @ApiResponse({
    status: 200,
    description: 'Blogs of specified author',
    type: [BlogResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Author not found or no blogs' })
  getBlogByAuthorId(
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ): Promise<BlogResponseDto[]> {
    return this.blogService.getBlogsByAuthorId(authorId);
  }
}
