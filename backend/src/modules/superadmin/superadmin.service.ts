import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuperadminUser } from '../../database/entities/superadmin';
import { CreateSuperadminDto, UpdateSuperadminDto, SuperadminDashboardDto } from './dto';
import { PasswordService } from '../../shared/services/password.service';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectRepository(SuperadminUser, 'superadmin')
    private readonly superadminUserRepository: Repository<SuperadminUser>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createSuperadminDto: CreateSuperadminDto): Promise<SuperadminUser> {
    const hashedPassword = await this.passwordService.hash(
      createSuperadminDto.password,
    );

    const superadmin = this.superadminUserRepository.create({
      ...createSuperadminDto,
      password: hashedPassword,
      role: 'superadmin',
    });

    return await this.superadminUserRepository.save(superadmin);
  }

  async findAll(): Promise<SuperadminUser[]> {
    return await this.superadminUserRepository.find();
  }

  async findOne(id: number): Promise<SuperadminUser> {
    const superadmin = await this.superadminUserRepository.findOne({
      where: { id },
    });

    if (!superadmin) {
      throw new NotFoundException(`Superadmin with ID ${id} not found`);
    }

    return superadmin;
  }

  async findByEmail(email: string): Promise<SuperadminUser | null> {
    return await this.superadminUserRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateSuperadminDto: UpdateSuperadminDto): Promise<SuperadminUser> {
    const superadmin = await this.findOne(id);

    if (updateSuperadminDto.password) {
      updateSuperadminDto.password = await this.passwordService.hash(
        updateSuperadminDto.password,
      );
    }

    Object.assign(superadmin, updateSuperadminDto);
    return await this.superadminUserRepository.save(superadmin);
  }

  async remove(id: number): Promise<void> {
    const superadmin = await this.findOne(id);
    await this.superadminUserRepository.remove(superadmin);
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.superadminUserRepository.update(id, {
      lastLogin: new Date(),
    });
  }

  async getDashboard(superadminId: number): Promise<SuperadminDashboardDto> {
    const superadmin = await this.findOne(superadminId);

    // TODO: Replace with actual data from other databases
    const dashboard: SuperadminDashboardDto = {
      profile: {
        firstName: superadmin.firstName,
        lastName: superadmin.lastName,
        email: superadmin.email,
        department: superadmin.department || 'System Administration',
        profileImage: superadmin.profileImage,
      },
      stats: {
        totalStudents: { label: 'Total Students', value: 0, total: 0 },
        totalTeachers: { label: 'Total Teachers', value: 0, total: 0 },
        totalInstitutes: { label: 'Total Institutes', value: 0, total: 0 },
        totalCourses: { label: 'Total Courses', value: 0, total: 0 },
      },
      recentActivity: [],
    };

    return dashboard;
  }

  async getOverview(superadminId: number) {
    const dashboard = await this.getDashboard(superadminId);
    return {
      profile: dashboard.profile,
      stats: dashboard.stats,
    };
  }
}
