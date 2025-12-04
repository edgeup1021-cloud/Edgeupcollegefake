import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherLibraryResource } from '../../../database/entities/teacher/teacher-library-resource.entity';
import {
  CreateLibraryResourceDto,
  UpdateLibraryResourceDto,
  QueryLibraryResourcesDto,
} from '../dto';

@Injectable()
export class LibraryTeacherService {
  constructor(
    @InjectRepository(TeacherLibraryResource)
    private resourceRepo: Repository<TeacherLibraryResource>,
  ) {}

  async create(
    dto: CreateLibraryResourceDto,
    teacherId: number,
  ): Promise<TeacherLibraryResource> {
    console.log('[create] Creating library resource with teacherId:', teacherId);
    console.log('[create] Resource data:', { title: dto.title, category: dto.category });

    const resource = this.resourceRepo.create({
      ...dto,
      uploadedBy: teacherId,
      status: 'ACTIVE',
    });

    const savedResource = await this.resourceRepo.save(resource);
    console.log('[create] Resource saved with ID:', savedResource.id);

    return savedResource;
  }

  async findAll(filters: QueryLibraryResourcesDto): Promise<TeacherLibraryResource[]> {
    console.log('[findAll] Query filters received:', filters);
    const query = this.resourceRepo.createQueryBuilder('r');

    if (filters.uploadedBy) {
      console.log('[findAll] Filtering by uploadedBy:', filters.uploadedBy);
      query.andWhere('r.uploadedBy = :uploadedBy', { uploadedBy: filters.uploadedBy });
    }

    if (filters.category) {
      query.andWhere('r.category = :category', { category: filters.category });
    }

    if (filters.subject) {
      query.andWhere('r.subject = :subject', { subject: filters.subject });
    }

    if (filters.status) {
      query.andWhere('r.status = :status', { status: filters.status });
    }

    if (filters.search) {
      query.andWhere(
        '(r.title LIKE :search OR r.description LIKE :search OR r.tags LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const results = await query.orderBy('r.createdAt', 'DESC').getMany();
    console.log('[findAll] Found', results.length, 'resources');
    return results;
  }

  async findOne(id: number): Promise<TeacherLibraryResource> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`Library resource with ID ${id} not found`);
    }

    return resource;
  }

  async update(
    id: number,
    dto: UpdateLibraryResourceDto,
    teacherId: number,
  ): Promise<TeacherLibraryResource> {
    const resource = await this.findOne(id);

    // Check ownership
    if (Number(resource.uploadedBy) !== teacherId) {
      throw new ForbiddenException(
        'You can only update your own library resources',
      );
    }

    Object.assign(resource, dto);
    return this.resourceRepo.save(resource);
  }

  async remove(id: number, teacherId: number): Promise<void> {
    const resource = await this.findOne(id);

    // Check ownership
    if (Number(resource.uploadedBy) !== teacherId) {
      throw new ForbiddenException(
        'You can only delete your own library resources',
      );
    }

    // Soft delete - set status to ARCHIVED
    resource.status = 'ARCHIVED';
    await this.resourceRepo.save(resource);
  }
}
