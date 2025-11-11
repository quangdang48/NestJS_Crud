import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogRequestDto } from './dto/request/create-blog.dto';
import { CreateBlogResponseDto } from './dto/response/create-blog.dto';
import { BlogResponseDto } from './dto/response/blog-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Blogs')
@Controller('blogs')
// @UseGuards(AuthGuard, RolesGuard)
export class BlogController {
  constructor(private blogService: BlogService) {}

  // Get all blogs
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({
    status: 200,
    description: 'List of blogs',
  })
  @Get()
  getAllBlogs(): Promise<BlogResponseDto[]> {
    return this.blogService.getAllBlogs();
  }

  // Get blog by ID
  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found blog',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  @Get(':blogId')
  getBlogByID(
    @Param('blogId', ParseUUIDPipe) id: string,
  ): Promise<BlogResponseDto> {
    return this.blogService.getBlogById(id);
  }
  // Create new blog
  @ApiOperation({ summary: 'Create new blog' })
  @ApiResponse({
    status: 200,
    description: 'The created blog',
  })
  @Roles([UserRole.ADMIN, UserRole.CUSTOMER])
  @Post()
  createNewBlog(
    @Body() newBlog: CreateBlogRequestDto,
  ): Promise<CreateBlogResponseDto> {
    return this.blogService.createBlog(newBlog);
  }
  // Delete blog by ID
  @ApiOperation({ summary: 'Delete a blog' })
  @ApiResponse({
    status: 200,
    description: 'Delete blog response',
  })
  @Delete(':blogId')
  deleteBlog(
    @Param('blogId', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.blogService.deleteBlog(id);
  }
  // Get blogs by Author ID
  @ApiOperation({ summary: 'Get blogs by Author ID' })
  @ApiResponse({
    status: 200,
    description: 'List of blogs by author',
  })
  @Get('author/:authorId')
  getBlogByAuthorId(
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ): Promise<BlogResponseDto[]> {
    return this.blogService.getBlogsByAuthorId(authorId);
  }
}
