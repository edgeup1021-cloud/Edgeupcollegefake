import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University, InstitutionType } from '../../../database/entities/superadmin/university.entity';
import { CreateUniversityDto, UpdateUniversityDto } from './dto';
import { InstitutionalHeadsService } from '../institutional-heads/institutional-heads.service';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University, 'superadmin')
    private universityRepository: Repository<University>,
    private institutionalHeadsService: InstitutionalHeadsService,
  ) {}

  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    // Check if code already exists
    const existing = await this.universityRepository.findOne({
      where: { code: createUniversityDto.code },
    });

    if (existing) {
      throw new ConflictException('A university with this code already exists');
    }

    // Validate college type for colleges
    if (
      createUniversityDto.institutionType === InstitutionType.COLLEGE &&
      !createUniversityDto.collegeType
    ) {
      throw new BadRequestException(
        'College type is required when institution type is College',
      );
    }

    // If institution type is University, college type should be null
    if (createUniversityDto.institutionType === InstitutionType.UNIVERSITY) {
      createUniversityDto.collegeType = null;
    }

    const university = this.universityRepository.create({
      ...createUniversityDto,
      isActive: true,
      institutionalHeadId: null,
    });

    return await this.universityRepository.save(university);
  }

  async findAll(): Promise<University[]> {
    return await this.universityRepository.find({
      relations: ['institutionalHead'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<University> {
    const university = await this.universityRepository.findOne({
      where: { id },
      relations: ['institutionalHead'],
    });

    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }

    return university;
  }

  async update(
    id: number,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<University> {
    const university = await this.findOne(id);

    // If code is being changed, check uniqueness
    if (updateUniversityDto.code && updateUniversityDto.code !== university.code) {
      const existing = await this.universityRepository.findOne({
        where: { code: updateUniversityDto.code },
      });

      if (existing) {
        throw new ConflictException('A university with this code already exists');
      }
    }

    // Validate college type for colleges
    const newInstitutionType =
      updateUniversityDto.institutionType || university.institutionType;
    if (
      newInstitutionType === InstitutionType.COLLEGE &&
      !updateUniversityDto.collegeType &&
      !university.collegeType
    ) {
      throw new BadRequestException(
        'College type is required when institution type is College',
      );
    }

    // If changing to University, clear college type
    if (updateUniversityDto.institutionType === InstitutionType.UNIVERSITY) {
      updateUniversityDto.collegeType = null;
    }

    Object.assign(university, updateUniversityDto);
    return await this.universityRepository.save(university);
  }

  async remove(id: number): Promise<void> {
    const university = await this.findOne(id);
    await this.universityRepository.remove(university);
  }

  /**
   * Assign an institutional head to a university
   * This calls the InstitutionalHeadsService which creates the admin_users record
   */
  async assignInstitutionalHead(
    universityId: number,
    institutionalHeadId: number,
  ): Promise<University> {
    // Call the institutional heads service to handle the assignment
    // This will create the admin_users record in edgeup_college database
    await this.institutionalHeadsService.assignToInstitution(
      institutionalHeadId,
      universityId,
    );

    // Return the updated university with the institutional head relation
    return await this.findOne(universityId);
  }

  /**
   * Unassign an institutional head from a university
   */
  async unassignInstitutionalHead(
    universityId: number,
    institutionalHeadId: number,
  ): Promise<University> {
    await this.institutionalHeadsService.unassignFromInstitution(
      institutionalHeadId,
      universityId,
    );

    return await this.findOne(universityId);
  }
}
