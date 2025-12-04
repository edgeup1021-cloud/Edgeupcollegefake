import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherLibraryResource } from '../../../database/entities/teacher/teacher-library-resource.entity';
import {
  StudentLibraryBookmark,
  StudentLibraryDownload,
  StudentLibraryAccessLog,
} from '../../../database/entities/student';
import { LibraryResourceCategory } from '../../../common/enums/status.enum';
import { QueryLibraryResourcesDto } from '../dto';

@Injectable()
export class LibraryStudentService {
  constructor(
    @InjectRepository(TeacherLibraryResource)
    private resourceRepo: Repository<TeacherLibraryResource>,
    @InjectRepository(StudentLibraryBookmark)
    private bookmarkRepo: Repository<StudentLibraryBookmark>,
    @InjectRepository(StudentLibraryDownload)
    private downloadRepo: Repository<StudentLibraryDownload>,
    @InjectRepository(StudentLibraryAccessLog)
    private accessLogRepo: Repository<StudentLibraryAccessLog>,
  ) {}

  async findAll(filters: QueryLibraryResourcesDto): Promise<TeacherLibraryResource[]> {
    console.log('[findAll] Student query filters:', filters);
    const query = this.resourceRepo.createQueryBuilder('r');

    // Students only see ACTIVE resources
    query.andWhere('r.status = :status', { status: 'ACTIVE' });

    if (filters.category) {
      query.andWhere('r.category = :category', { category: filters.category });
    }

    if (filters.subject) {
      query.andWhere('r.subject = :subject', { subject: filters.subject });
    }

    if (filters.type) {
      query.andWhere('r.type = :type', { type: filters.type });
    }

    if (filters.search) {
      query.andWhere(
        '(r.title LIKE :search OR r.description LIKE :search OR r.tags LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortField = filters.sortBy === 'date' ? 'r.createdAt' : `r.${filters.sortBy}`;
      const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
      query.orderBy(sortField, sortOrder);
    } else {
      query.orderBy('r.createdAt', 'DESC');
    }

    const results = await query.getMany();
    console.log('[findAll] Found', results.length, 'active resources for student');
    return results;
  }

  async findOne(id: number): Promise<TeacherLibraryResource> {
    const resource = await this.resourceRepo.findOne({
      where: { id, status: 'ACTIVE' },
    });

    if (!resource) {
      throw new NotFoundException(
        `Library resource with ID ${id} not found or is no longer available`,
      );
    }

    return resource;
  }

  getCategories(): string[] {
    return Object.values(LibraryResourceCategory);
  }

  // Statistics
  async getStatistics(studentId: number) {
    const [totalResources, bookmarks, downloads, recentCount] = await Promise.all([
      this.resourceRepo.count({ where: { status: 'ACTIVE' } }),
      this.bookmarkRepo.count({ where: { studentId } }),
      this.downloadRepo
        .createQueryBuilder('d')
        .select('COUNT(DISTINCT d.resourceId)', 'count')
        .where('d.studentId = :studentId', { studentId })
        .getRawOne()
        .then(result => parseInt(result.count, 10)),
      this.accessLogRepo
        .createQueryBuilder('a')
        .select('COUNT(DISTINCT a.resourceId)', 'count')
        .where('a.studentId = :studentId', { studentId })
        .andWhere('a.accessedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
        .getRawOne()
        .then(result => parseInt(result.count, 10)),
    ]);

    return {
      totalResources,
      bookmarks,
      downloads,
      recentlyAccessed: recentCount,
    };
  }

  // Bookmarks
  async getBookmarks(studentId: number) {
    const bookmarks = await this.bookmarkRepo.find({
      where: { studentId },
      relations: ['resource'],
      order: { bookmarkedAt: 'DESC' },
    });

    return bookmarks.map(b => ({
      resourceId: b.resourceId,
      resource: b.resource,
      bookmarkedAt: b.bookmarkedAt,
    }));
  }

  async addBookmark(studentId: number, resourceId: number) {
    // Check if resource exists and is active
    const resource = await this.findOne(resourceId);

    // Check if already bookmarked
    const existing = await this.bookmarkRepo.findOne({
      where: { studentId, resourceId },
    });

    if (existing) {
      throw new ConflictException('Resource is already bookmarked');
    }

    const bookmark = this.bookmarkRepo.create({
      studentId,
      resourceId,
    });

    await this.bookmarkRepo.save(bookmark);
    return { message: 'Bookmark added successfully' };
  }

  async removeBookmark(studentId: number, resourceId: number) {
    const result = await this.bookmarkRepo.delete({ studentId, resourceId });

    if (result.affected === 0) {
      throw new NotFoundException('Bookmark not found');
    }

    return { message: 'Bookmark removed successfully' };
  }

  // Downloads
  async getDownloads(studentId: number) {
    const downloads = await this.downloadRepo.find({
      where: { studentId },
      relations: ['resource'],
      order: { downloadedAt: 'DESC' },
    });

    return downloads.map(d => ({
      resourceId: d.resourceId,
      resource: d.resource,
      downloadedAt: d.downloadedAt,
    }));
  }

  async recordDownload(studentId: number, resourceId: number) {
    // Check if resource exists and is active
    await this.findOne(resourceId);

    const download = this.downloadRepo.create({
      studentId,
      resourceId,
    });

    await this.downloadRepo.save(download);
    return { message: 'Download recorded successfully' };
  }

  // Recently Accessed
  async getRecentlyAccessed(studentId: number) {
    const logs = await this.accessLogRepo
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.resource', 'resource')
      .where('log.studentId = :studentId', { studentId })
      .andWhere('resource.status = :status', { status: 'ACTIVE' })
      .orderBy('log.accessedAt', 'DESC')
      .limit(20)
      .getMany();

    // Group by resource to get unique resources with latest access time
    const uniqueResources = new Map();
    logs.forEach(log => {
      if (!uniqueResources.has(log.resourceId)) {
        uniqueResources.set(log.resourceId, {
          ...log.resource,
          accessedAt: log.accessedAt,
        });
      }
    });

    return Array.from(uniqueResources.values());
  }

  async recordAccess(studentId: number, resourceId: number) {
    // Check if resource exists and is active
    await this.findOne(resourceId);

    const log = this.accessLogRepo.create({
      studentId,
      resourceId,
    });

    await this.accessLogRepo.save(log);
    return { message: 'Access recorded successfully' };
  }
}
