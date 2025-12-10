import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  StudentDiscussionPost,
  StudentDiscussionComment,
  StudentDiscussionUpvote,
  StudentUser,
} from '../../database/entities/student';
import {
  CreateDiscussionPostDto,
  UpdateDiscussionPostDto,
  QueryDiscussionPostsDto,
  CreateCommentDto,
  ArchivePostDto,
} from './dto';
import { DiscussionPostStatus } from '../../common/enums/status.enum';

@Injectable()
export class DiscussionForumService {
  constructor(
    @InjectRepository(StudentDiscussionPost)
    private readonly postRepo: Repository<StudentDiscussionPost>,
    @InjectRepository(StudentDiscussionComment)
    private readonly commentRepo: Repository<StudentDiscussionComment>,
    @InjectRepository(StudentDiscussionUpvote)
    private readonly upvoteRepo: Repository<StudentDiscussionUpvote>,
    @InjectRepository(StudentUser)
    private readonly studentRepo: Repository<StudentUser>,
    private readonly dataSource: DataSource,
  ) {}

  // ==================== CRUD Operations ====================

  async create(
    dto: CreateDiscussionPostDto,
    studentId: number,
  ): Promise<StudentDiscussionPost> {
    const post = this.postRepo.create({
      ...dto,
      studentId,
      status: DiscussionPostStatus.ACTIVE,
    });

    return this.postRepo.save(post);
  }

  async findAll(
    filters: QueryDiscussionPostsDto,
    currentStudentId?: number,
  ): Promise<StudentDiscussionPost[]> {
    const query = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.student', 'student');

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
        status: DiscussionPostStatus.ACTIVE,
      });
    }

    // Filter by student
    if (filters.studentId) {
      query.andWhere('post.studentId = :studentId', {
        studentId: filters.studentId,
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

    // Filter by solved status
    if (filters.solvedOnly) {
      query.andWhere('post.isSolved = :isSolved', { isSolved: true });
    }
    if (filters.unsolvedOnly) {
      query.andWhere('post.isSolved = :isSolved', { isSolved: false });
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

    // Check which posts the current student has upvoted
    if (currentStudentId && posts.length > 0) {
      const postIds = posts.map((post) => post.id);

      const upvoteResults = await this.upvoteRepo
        .createQueryBuilder('upvote')
        .select('upvote.postId')
        .where('upvote.studentId = :studentId', { studentId: currentStudentId })
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

    // Return posts without hasUpvoted flag if no currentStudentId
    return posts.map((post) => ({
      ...post,
      hasUpvoted: false,
    })) as any;
  }

  async findOne(
    id: number,
    currentStudentId?: number,
  ): Promise<StudentDiscussionPost> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['student', 'comments', 'comments.student', 'upvotes'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if current student has upvoted this post
    let hasUpvoted = false;
    if (currentStudentId) {
      const upvote = await this.upvoteRepo.findOne({
        where: { postId: id, studentId: currentStudentId },
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
    dto: UpdateDiscussionPostDto,
    studentId: number,
  ): Promise<StudentDiscussionPost> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check ownership - convert bigint to number
    if (Number(post.studentId) !== studentId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  async remove(id: number, studentId: number): Promise<void> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check ownership - convert bigint to number
    if (Number(post.studentId) !== studentId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepo.remove(post);
  }

  async setArchived(
    id: number,
    dto: ArchivePostDto,
    studentId: number,
  ): Promise<StudentDiscussionPost> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check ownership - convert bigint to number
    if (Number(post.studentId) !== studentId) {
      throw new ForbiddenException('You can only archive your own posts');
    }

    post.status = dto.archived
      ? DiscussionPostStatus.ARCHIVED
      : DiscussionPostStatus.ACTIVE;

    return this.postRepo.save(post);
  }

  // ==================== Mark as Solved ====================

  async markAsSolved(
    id: number,
    studentId: number,
  ): Promise<StudentDiscussionPost> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check ownership - only post author can mark as solved
    // Convert both to numbers for comparison (bigint from DB is string)
    const postOwnerId = Number(post.studentId);
    if (postOwnerId !== studentId) {
      throw new ForbiddenException('Only the post author can mark as solved');
    }

    post.isSolved = true;
    return this.postRepo.save(post);
  }

  async markCommentAsSolution(
    commentId: number,
    studentId: number,
  ): Promise<StudentDiscussionComment> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['post'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check ownership - only post author can mark comment as solution
    // Convert both to numbers for comparison (bigint from DB is string)
    const postOwnerId = Number(comment.post.studentId);
    if (postOwnerId !== studentId) {
      throw new ForbiddenException(
        'Only the post author can mark comments as solution',
      );
    }

    comment.isSolution = true;
    return this.commentRepo.save(comment);
  }

  // ==================== Upvote Operations ====================

  async toggleUpvote(
    postId: number,
    studentId: number,
  ): Promise<{ upvoted: boolean; upvoteCount: number }> {
    const post = await this.postRepo.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      const existing = await manager
        .getRepository(StudentDiscussionUpvote)
        .findOne({
          where: { postId, studentId },
        });

      if (existing) {
        // Remove upvote
        await manager.getRepository(StudentDiscussionUpvote).remove(existing);
        await manager
          .getRepository(StudentDiscussionPost)
          .decrement({ id: postId }, 'upvoteCount', 1);

        return {
          upvoted: false,
          upvoteCount: Math.max(0, post.upvoteCount - 1),
        };
      } else {
        // Add upvote
        const upvote = manager
          .getRepository(StudentDiscussionUpvote)
          .create({ postId, studentId });
        await manager.getRepository(StudentDiscussionUpvote).save(upvote);
        await manager
          .getRepository(StudentDiscussionPost)
          .increment({ id: postId }, 'upvoteCount', 1);

        return {
          upvoted: true,
          upvoteCount: post.upvoteCount + 1,
        };
      }
    });
  }

  async getUpvoters(postId: number): Promise<StudentUser[]> {
    const upvotes = await this.upvoteRepo.find({
      where: { postId },
      relations: ['student'],
    });

    return upvotes.map((upvote) => upvote.student);
  }

  // ==================== Comment Operations ====================

  async addComment(
    postId: number,
    dto: CreateCommentDto,
    studentId: number,
  ): Promise<StudentDiscussionComment> {
    const post = await this.postRepo.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      const comment = manager.getRepository(StudentDiscussionComment).create({
        postId,
        studentId,
        content: dto.content,
      });

      const savedComment = await manager
        .getRepository(StudentDiscussionComment)
        .save(comment);

      await manager
        .getRepository(StudentDiscussionPost)
        .increment({ id: postId }, 'commentCount', 1);

      // Load student relation for response
      const commentWithStudent = await manager
        .getRepository(StudentDiscussionComment)
        .findOne({
          where: { id: savedComment.id },
          relations: ['student'],
        });

      return commentWithStudent!;
    });
  }

  async getComments(
    postId: number,
    limit = 20,
    offset = 0,
  ): Promise<StudentDiscussionComment[]> {
    return this.commentRepo.find({
      where: { postId },
      relations: ['student'],
      order: { createdAt: 'ASC' },
      take: limit,
      skip: offset,
    });
  }

  async updateComment(
    commentId: number,
    dto: CreateCommentDto,
    studentId: number,
  ): Promise<StudentDiscussionComment> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check ownership - convert bigint to number
    if (Number(comment.studentId) !== studentId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    comment.content = dto.content;
    return this.commentRepo.save(comment);
  }

  async removeComment(commentId: number, studentId: number): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check ownership - convert bigint to number
    if (Number(comment.studentId) !== studentId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(StudentDiscussionComment).remove(comment);
      await manager
        .getRepository(StudentDiscussionPost)
        .decrement({ id: comment.postId }, 'commentCount', 1);
    });
  }

  // ==================== Student-Specific Operations ====================

  async getMyPosts(
    studentId: number,
    status?: DiscussionPostStatus,
  ): Promise<StudentDiscussionPost[]> {
    const query = this.postRepo
      .createQueryBuilder('post')
      .where('post.studentId = :studentId', { studentId });

    if (status) {
      query.andWhere('post.status = :status', { status });
    }

    return query.orderBy('post.createdAt', 'DESC').getMany();
  }

  async getMyUpvotedPosts(
    studentId: number,
  ): Promise<StudentDiscussionPost[]> {
    const upvotes = await this.upvoteRepo.find({
      where: { studentId },
      relations: ['post', 'post.student'],
      order: { createdAt: 'DESC' },
    });

    return upvotes.map((upvote) => upvote.post);
  }
}
