import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TeacherPublication,
  PublicationStatus,
} from '../../../database/entities/teacher/teacher-publication.entity';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
  QueryPublicationsDto,
} from '../dto/publications';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(TeacherPublication)
    private readonly publicationRepository: Repository<TeacherPublication>,
  ) {}

  // Create a new publication
  async create(dto: CreatePublicationDto, teacherId: number) {
    const publication = this.publicationRepository.create({
      ...dto,
      teacherId,
      publicationDate: new Date(dto.publicationDate),
      citationsCount: dto.citationsCount || 0,
    });

    const saved = await this.publicationRepository.save(publication);

    return {
      ...saved,
      publicationDate:
        typeof saved.publicationDate === 'string'
          ? saved.publicationDate
          : saved.publicationDate.toISOString().split('T')[0],
    };
  }

  // Get all publications for a teacher with optional filters
  async findAll(filters: QueryPublicationsDto) {
    const {
      teacherId,
      status,
      search,
      year,
      limit = 50,
      offset = 0,
    } = filters;

    const query = this.publicationRepository.createQueryBuilder('pub');

    // Filter by teacher
    if (teacherId) {
      query.andWhere('pub.teacherId = :teacherId', { teacherId });
    }

    // Filter by status
    if (status) {
      query.andWhere('pub.status = :status', { status });
    }

    // Search in title or journal name
    if (search) {
      query.andWhere(
        '(pub.publicationTitle LIKE :search OR pub.journalConferenceName LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter by year
    if (year) {
      query.andWhere('YEAR(pub.publicationDate) = :year', { year });
    }

    const publications = await query
      .orderBy('pub.publicationDate', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();

    return publications.map((pub) => ({
      ...pub,
      publicationDate:
        typeof pub.publicationDate === 'string'
          ? pub.publicationDate
          : pub.publicationDate.toISOString().split('T')[0],
    }));
  }

  // Get a single publication by ID
  async findOne(id: number, teacherId?: number) {
    const publication = await this.publicationRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!publication) {
      throw new NotFoundException(`Publication with ID ${id} not found`);
    }

    // Optional authorization check
    if (teacherId && publication.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You do not have permission to view this publication',
      );
    }

    return {
      ...publication,
      publicationDate:
        typeof publication.publicationDate === 'string'
          ? publication.publicationDate
          : publication.publicationDate.toISOString().split('T')[0],
    };
  }

  // Update a publication
  async update(id: number, dto: UpdatePublicationDto, teacherId: number) {
    const publication = await this.publicationRepository.findOne({
      where: { id, teacherId },
    });

    if (!publication) {
      throw new NotFoundException(
        'Publication not found or you do not have permission to update it',
      );
    }

    Object.assign(publication, {
      ...dto,
      publicationDate: dto.publicationDate
        ? new Date(dto.publicationDate)
        : publication.publicationDate,
    });

    const updated = await this.publicationRepository.save(publication);

    return {
      ...updated,
      publicationDate:
        typeof updated.publicationDate === 'string'
          ? updated.publicationDate
          : updated.publicationDate.toISOString().split('T')[0],
    };
  }

  // Delete a publication
  async remove(id: number, teacherId: number) {
    const publication = await this.publicationRepository.findOne({
      where: { id, teacherId },
    });

    if (!publication) {
      throw new NotFoundException(
        'Publication not found or you do not have permission to delete it',
      );
    }

    await this.publicationRepository.remove(publication);

    return { message: 'Publication deleted successfully' };
  }

  // Get statistics for a teacher's publications
  async getStatistics(teacherId: number) {
    const publications = await this.publicationRepository.find({
      where: { teacherId },
    });

    const stats = {
      totalPublications: publications.length,
      published: publications.filter(
        (p) => p.status === PublicationStatus.PUBLISHED,
      ).length,
      underReview: publications.filter(
        (p) => p.status === PublicationStatus.UNDER_REVIEW,
      ).length,
      inProgress: publications.filter(
        (p) => p.status === PublicationStatus.IN_PROGRESS,
      ).length,
      rejected: publications.filter(
        (p) => p.status === PublicationStatus.REJECTED,
      ).length,
      totalCitations: publications.reduce(
        (sum, p) => sum + (p.citationsCount || 0),
        0,
      ),
      averageImpactFactor: this.calculateAverageImpactFactor(publications),
      publicationsByYear: this.groupPublicationsByYear(publications),
    };

    return stats;
  }

  // Helper: Calculate average impact factor
  private calculateAverageImpactFactor(
    publications: TeacherPublication[],
  ): number | null {
    const withImpactFactor = publications.filter(
      (p) => p.impactFactor !== null && p.impactFactor > 0,
    );

    if (withImpactFactor.length === 0) {
      return null;
    }

    const total = withImpactFactor.reduce(
      (sum, p) => sum + Number(p.impactFactor),
      0,
    );

    return Math.round((total / withImpactFactor.length) * 100) / 100;
  }

  // Helper: Group publications by year
  private groupPublicationsByYear(
    publications: TeacherPublication[],
  ): Record<string, number> {
    const grouped: Record<string, number> = {};

    publications.forEach((pub) => {
      const date = pub.publicationDate as Date | string;
      let year: string;

      if (typeof date === 'string') {
        year = date.split('-')[0];
      } else if (date instanceof Date) {
        year = date.getFullYear().toString();
      } else {
        year = 'Unknown';
      }

      grouped[year] = (grouped[year] || 0) + 1;
    });

    return grouped;
  }
}
