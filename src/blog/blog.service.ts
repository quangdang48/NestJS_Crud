import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBlogRequestDto } from './dto/request/create-blog.dto';
import { CreateBlogResponseDto } from './dto/response/create-blog.dto';
import { BlogResponseDto } from './dto/response/blog-response.dto';
import { BlogOptionDto } from './dto/request/blog-option.dto';
import { BlogPageDto } from './dto/response/blog-page.dto';
import { Prisma } from '@prisma/client';
import { Order } from 'src/common/dto';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  /** Get a single blog by ID */
  async getBlogById(id: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findFirst({
      where: { id, isActive: true },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return BlogResponseDto.fromEntity(blog);
  }

  /** Get paginated blogs of a user with optional search */
  async getBlogsOfUser(
    blogOptions: BlogOptionDto,
    userId: string,
  ): Promise<BlogPageDto> {
    const where = {
      authorId: userId,
      isActive: true,
      ...(blogOptions.search
        ? {
            title: {
              contains: blogOptions.search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {}),
    };
    const orderBy: Prisma.BlogOrderByWithRelationInput = {
      createdAt: blogOptions.order === Order.ASC ? 'asc' : 'desc',
    };
    const [blogs, totalItems] = await Promise.all([
      this.prismaService.blog.findMany({
        where,
        orderBy,
        skip: blogOptions.skip,
        take: blogOptions.pageSize,
      }),
      this.prismaService.blog.count({ where }),
    ]);

    const blogDto = blogs.map((blog) => BlogResponseDto.fromEntity(blog));

    return {
      data: blogDto,
      pageNumber: blogOptions.pageNumber,
      pageSize: blogOptions.pageSize,
      total: totalItems,
      totalPages: Math.ceil(totalItems / blogOptions.pageSize),
    };
  }

  /** Create a new blog */
  async createBlog(
    newBlog: CreateBlogRequestDto,
  ): Promise<CreateBlogResponseDto> {
    const createdBlog = await this.prismaService.blog.create({
      data: {
        title: newBlog.title,
        content: newBlog.content,
        authorId: newBlog.authorId,
      },
    });
    return CreateBlogResponseDto.fromEntity(createdBlog);
  }

  /** Delete a blog if the user is the owner */
  async deleteBlog(
    blogId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const blog = await this.prismaService.blog.findFirst({
      where: { id: blogId, isActive: true },
    });
    if (!blog || blog.authorId !== userId) {
      throw new NotFoundException('Blog not found or you are not the owner');
    }

    await this.prismaService.blog.update({
      where: { id: blogId },
      data: { isActive: false, deletedAt: new Date() },
    });

    return { message: 'Blog deleted successfully' };
  }
  /** Get all blogs by author ID */
  async getBlogsByAuthorId(authorId: string): Promise<BlogResponseDto[]> {
    const blogs = await this.prismaService.blog.findMany({
      where: { authorId, isActive: true },
    });
    if (!blogs.length)
      throw new NotFoundException('No blogs found for this author');
    return blogs.map((blog) => BlogResponseDto.fromEntity(blog));
  }
}
