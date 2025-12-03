import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherLibraryResource } from '../../../database/entities/teacher/teacher-library-resource.entity';
import { LibraryResourceCategory } from '../../../common/enums/status.enum';
import { QueryLibraryResourcesDto } from '../dto';

@Injectable()
export class LibraryStudentService {
  constructor(
    @InjectRepository(TeacherLibraryResource)
    private resourceRepo: Repository<TeacherLibraryResource>,
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

    if (filters.search) {
      query.andWhere(
        '(r.title LIKE :search OR r.description LIKE :search OR r.tags LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const results = await query.orderBy('r.createdAt', 'DESC').getMany();
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
}
