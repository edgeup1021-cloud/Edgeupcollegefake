import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  TeacherIdeaSandboxPost,
  TeacherIdeaSandboxComment,
  TeacherIdeaSandboxUpvote,
  TeacherUser,
} from '../../../database/entities/teacher';
import {
  CreateIdeaSandboxPostDto,
  UpdateIdeaSandboxPostDto,
  QueryIdeaSandboxPostsDto,
  CreateCommentDto,
  ArchivePostDto,
} from '../dto/idea-sandbox';
import { IdeaSandboxPostStatus } from '../../../common/enums/status.enum';

@Injectable()
export class IdeaSandboxService {
  constructor(
    @InjectRepository(TeacherIdeaSandboxPost)
    private readonly postRepo: Repository<TeacherIdeaSandboxPost>,
    @InjectRepository(TeacherIdeaSandboxComment)
    private readonly commentRepo: Repository<TeacherIdeaSandboxComment>,
    @InjectRepository(TeacherIdeaSandboxUpvote)
    private readonly upvoteRepo: Repository<TeacherIdeaSandboxUpvote>,
    @InjectRepository(TeacherUser)
    private readonly teacherRepo: Repository<TeacherUser>,
    private readonly dataSource: DataSource,
  ) {}

  // ==================== CRUD Operations ====================

  async create(
    dto: CreateIdeaSandboxPostDto,
    teacherId: number,
  ): Promise<TeacherIdeaSandboxPost> {
    const post = this.postRepo.create({
      ...dto,
      teacherId,
      status: IdeaSandboxPostStatus.ACTIVE,
    });

    return this.postRepo.save(post);
  }

  async findAll(
    filters: QueryIdeaSandboxPostsDto,
    currentTeacherId?: number,
  ): Promise<TeacherIdeaSandboxPost[]> {
    const query = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.teacher', 'teacher');

    // Filter by type
    if (filters.type) {
      query.andWhere('post.type = :type', { type: filters.type });
    }

    // Filter by category
    if (filters.category) {
      query.andWhere('post.category = :category', {
        category: filters.category,
      });
    }

    // Filter by status
    if (filters.status) {
      query.andWhere('post.status = :status', { status: filters.status });
    } else {
      // Default to active posts only
      query.andWhere('post.status = :status', {
        status: IdeaSandboxPostStatus.ACTIVE,
      });
    }

    // Filter by teacher
    if (filters.teacherId) {
      query.andWhere('post.teacherId = :teacherId', {
        teacherId: filters.teacherId,
      });
    }

    // Search in title and description
    if (filters.search) {
      query.andWhere(
        '(post.title LIKE :search OR post.description LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Filter by tags (JSON array contains check)
    if (filters.tags) {
      const tagArray = filters.tags.split(',').map((tag) => tag.trim());
      tagArray.forEach((tag, index) => {
        query.andWhere(`JSON_CONTAINS(post.tags, :tag${index})`, {
          [`tag${index}`]: JSON.stringify(tag),
        });
      });
    }

    // Sort by
    const sortBy = filters.sortBy || 'recent';
    switch (sortBy) {
      case 'popular':
        query.orderBy('post.upvoteCount', 'DESC');
        break;
      case 'most_commented':
        query.orderBy('post.commentCount', 'DESC');
        break;
      case 'recent':
      default:
        query.orderBy('post.createdAt', 'DESC');
        break;
    }

    // Pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    query.take(limit).skip(offset);

    const posts = await query.getMany();

    // Check which posts the current teacher has upvoted
    if (currentTeacherId && posts.length > 0) {
      const postIds = posts.map((post) => post.id);

      const upvoteResults = await this.upvoteRepo
        .createQueryBuilder('upvote')
        .select('upvote.postId')
        .where('upvote.teacherId = :teacherId', { teacherId: currentTeacherId })
        .andWhere('upvote.postId IN (:...postIds)', { postIds })
        .getRawMany();

      const upvotedPostIds = new Set(
        upvoteResults.map((row) => Number(row.upvote_post_id)),
      );

      // Map to plain objects with hasUpvoted flag
      return posts.map((post) => ({
        ...post,
        hasUpvoted: upvotedPostIds.has(Number(post.id)),
      })) as any;
    }

    // Return posts without hasUpvoted flag if no currentTeacherId
    return posts.map((post) => ({
      ...post,
      hasUpvoted: false,
    })) as any;
  }

  async findOne(
    id: number,
    currentTeacherId?: number,
  ): Promise<TeacherIdeaSandboxPost> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['teacher', 'comments', 'comments.teacher', 'upvotes'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if current teacher has upvoted this post
    let hasUpvoted = false;
    if (currentTeacherId) {
      const upvote = await this.upvoteRepo.findOne({
        where: { postId: id, teacherId: currentTeacherId },
      });
      hasUpvoted = !!upvote;
    }

    return {
      ...post,
      hasUpvoted,
    } as any;
  }

  async update(
    id: number,
    dto: UpdateIdeaSandboxPostDto,
    teacherId: number,
  ): Promise<TeacherIdeaSandboxPost> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check ownership
    if (post.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  async remove(id: number, teacherId: number): Promise<void> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check ownership
    if (post.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepo.remove(post);
  }

  async setArchived(
    id: number,
    dto: ArchivePostDto,
    teacherId: number,
  ): Promise<TeacherIdeaSandboxPost> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check ownership
    if (post.teacherId !== teacherId) {
      throw new ForbiddenException('You can only archive your own posts');
    }

    post.status = dto.archived
      ? IdeaSandboxPostStatus.ARCHIVED
      : IdeaSandboxPostStatus.ACTIVE;

    return this.postRepo.save(post);
  }

  // ==================== Upvote Operations ====================

  async toggleUpvote(
    postId: number,
    teacherId: number,
  ): Promise<{ upvoted: boolean; upvoteCount: number }> {
    const post = await this.postRepo.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      const existing = await manager
        .getRepository(TeacherIdeaSandboxUpvote)
        .findOne({
          where: { postId, teacherId },
        });

      if (existing) {
        // Remove upvote
        await manager.getRepository(TeacherIdeaSandboxUpvote).remove(existing);
        await manager
          .getRepository(TeacherIdeaSandboxPost)
          .decrement({ id: postId }, 'upvoteCount', 1);

        return {
          upvoted: false,
          upvoteCount: Math.max(0, post.upvoteCount - 1),
        };
      } else {
        // Add upvote
        const upvote = manager
          .getRepository(TeacherIdeaSandboxUpvote)
          .create({ postId, teacherId });
        await manager.getRepository(TeacherIdeaSandboxUpvote).save(upvote);
        await manager
          .getRepository(TeacherIdeaSandboxPost)
          .increment({ id: postId }, 'upvoteCount', 1);

        return {
          upvoted: true,
          upvoteCount: post.upvoteCount + 1,
        };
      }
    });
  }

  async getUpvoters(postId: number): Promise<TeacherUser[]> {
    const upvotes = await this.upvoteRepo.find({
      where: { postId },
      relations: ['teacher'],
    });

    return upvotes.map((upvote) => upvote.teacher);
  }

  // ==================== Comment Operations ====================

  async addComment(
    postId: number,
    dto: CreateCommentDto,
    teacherId: number,
  ): Promise<TeacherIdeaSandboxComment> {
    const post = await this.postRepo.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      const comment = manager.getRepository(TeacherIdeaSandboxComment).create({
        postId,
        teacherId,
        content: dto.content,
      });

      const savedComment = await manager
        .getRepository(TeacherIdeaSandboxComment)
        .save(comment);

      await manager
        .getRepository(TeacherIdeaSandboxPost)
        .increment({ id: postId }, 'commentCount', 1);

      // Load teacher relation for response
      const commentWithTeacher = await manager
        .getRepository(TeacherIdeaSandboxComment)
        .findOne({
          where: { id: savedComment.id },
          relations: ['teacher'],
        });

      return commentWithTeacher!;
    });
  }

  async getComments(
    postId: number,
    limit = 20,
    offset = 0,
  ): Promise<TeacherIdeaSandboxComment[]> {
    return this.commentRepo.find({
      where: { postId },
      relations: ['teacher'],
      order: { createdAt: 'ASC' },
      take: limit,
      skip: offset,
    });
  }

  async updateComment(
    commentId: number,
    dto: CreateCommentDto,
    teacherId: number,
  ): Promise<TeacherIdeaSandboxComment> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check ownership
    if (comment.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    comment.content = dto.content;
    return this.commentRepo.save(comment);
  }

  async removeComment(commentId: number, teacherId: number): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check ownership
    if (comment.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(TeacherIdeaSandboxComment).remove(comment);
      await manager
        .getRepository(TeacherIdeaSandboxPost)
        .decrement({ id: comment.postId }, 'commentCount', 1);
    });
  }

  // ==================== Teacher-Specific Operations ====================

  async getMyPosts(
    teacherId: number,
    status?: IdeaSandboxPostStatus,
  ): Promise<TeacherIdeaSandboxPost[]> {
    const query = this.postRepo
      .createQueryBuilder('post')
      .where('post.teacherId = :teacherId', { teacherId });

    if (status) {
      query.andWhere('post.status = :status', { status });
    }

    return query.orderBy('post.createdAt', 'DESC').getMany();
  }

  async getMyUpvotedPosts(
    teacherId: number,
  ): Promise<TeacherIdeaSandboxPost[]> {
    const upvotes = await this.upvoteRepo.find({
      where: { teacherId },
      relations: ['post', 'post.teacher'],
      order: { createdAt: 'DESC' },
    });

    return upvotes.map((upvote) => upvote.post);
  }
}
