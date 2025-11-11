import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogRequestDto } from './dto/request/create-blog.dto';
import { CreateBlogResponseDto } from './dto/response/create-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogResponseDto } from './dto/response/blog-response.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}
  // Get blog by ID
  async getBlogById(id: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findFirst({
      where: { id: id, isActive: true },
    });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return BlogResponseDto.fromEntity(blog);
  }
  // Delete blog by ID
  async deleteBlog(
    blogId: string,
    authorId: string,
  ): Promise<{ message: string }> {
    const isOwner = await this.checkOwnerShip(blogId, authorId);
    if (!isOwner) {
      throw new NotFoundException('Blog not found or you are not the owner');
    }
    // Implementation for deleting a blog entry
    await this.prismaService.blog.update({
      where: { id: blogId, isActive: true },
      data: { isActive: false, deletedAt: new Date() },
    });
    return { message: 'Blog deleted successfully' };
  }
  // Create new blog
  async createBlog(
    newBlog: CreateBlogRequestDto,
  ): Promise<CreateBlogResponseDto> {
    // Check existing author
    const author = await this.prismaService.user.findFirst({
      where: { isActive: true },
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    // Implementation for creating a new blog entry
    const createdBlog = await this.prismaService.blog.create({
      data: {
        title: newBlog.title,
        content: newBlog.content,
        authorId: newBlog.authorId,
      },
    });
    // Return value mapped to CreateBlogResponseDto
    return CreateBlogResponseDto.fromEntity(createdBlog);
  }
  // Get all blogs
  async getAllBlogs(): Promise<BlogResponseDto[]> {
    const blogs = await this.prismaService.blog.findMany({
      where: { isActive: true },
    });
    return blogs.map((blog) => BlogResponseDto.fromEntity(blog));
  }
  // Get blogs by author ID
  async getBlogsByAuthorId(authorId: string): Promise<BlogResponseDto[]> {
    // Check existing author
    const author = await this.prismaService.user.findFirst({
      where: { id: authorId, isActive: true },
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    // Get all blogs by author ID
    const blogs = await this.prismaService.blog.findMany({
      where: { authorId: authorId, isActive: true },
    });
    return blogs.map((blog) => BlogResponseDto.fromEntity(blog));
  }
  async checkOwnerShip(blogAuthorId: string, userId: string): Promise<boolean> {
    const blog = await this.prismaService.blog.findFirst({
      where: { authorId: blogAuthorId, isActive: true },
    });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog.authorId === userId;
  }
}
