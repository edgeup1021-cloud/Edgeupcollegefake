import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InstitutionalHead } from '../../../database/entities/superadmin';
import {
  CreateInstitutionalHeadDto,
  UpdateInstitutionalHeadDto,
  AssignToInstitutionDto,
} from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstitutionalHeadsService {
  constructor(
    @InjectRepository(InstitutionalHead, 'superadmin')
    private institutionalHeadRepository: Repository<InstitutionalHead>,
    @Inject('DATA_SOURCE')
    private collegeDataSource: DataSource,
    @Inject('SUPERADMIN_DATA_SOURCE')
    private superadminDataSource: DataSource,
  ) {}

  async create(
    createInstitutionalHeadDto: CreateInstitutionalHeadDto,
  ): Promise<InstitutionalHead> {
    // Check if email already exists
    const existing = await this.institutionalHeadRepository.findOne({
      where: { email: createInstitutionalHeadDto.email },
    });

    if (existing) {
      throw new ConflictException(
        'An institutional head with this email already exists',
      );
    }

    const institutionalHead = this.institutionalHeadRepository.create({
      ...createInstitutionalHeadDto,
      isActive: true,
      adminUserId: null, // Will be set during assignment
    });

    return await this.institutionalHeadRepository.save(institutionalHead);
  }

  async findAll(): Promise<InstitutionalHead[]> {
    return await this.institutionalHeadRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<InstitutionalHead> {
    const institutionalHead = await this.institutionalHeadRepository.findOne({
      where: { id },
    });

    if (!institutionalHead) {
      throw new NotFoundException(
        `Institutional head with ID ${id} not found`,
      );
    }

    return institutionalHead;
  }

  async update(
    id: number,
    updateInstitutionalHeadDto: UpdateInstitutionalHeadDto,
  ): Promise<InstitutionalHead> {
    const institutionalHead = await this.findOne(id);

    // If email is being changed, check uniqueness
    if (
      updateInstitutionalHeadDto.email &&
      updateInstitutionalHeadDto.email !== institutionalHead.email
    ) {
      const existing = await this.institutionalHeadRepository.findOne({
        where: { email: updateInstitutionalHeadDto.email },
      });

      if (existing) {
        throw new ConflictException(
          'An institutional head with this email already exists',
        );
      }
    }

    Object.assign(institutionalHead, updateInstitutionalHeadDto);
    return await this.institutionalHeadRepository.save(institutionalHead);
  }

  async remove(id: number): Promise<void> {
    const institutionalHead = await this.findOne(id);

    // Check if assigned to any institution
    const universityCount = await this.superadminDataSource.query(
      'SELECT COUNT(*) as count FROM universities WHERE institutional_head_id = ?',
      [id],
    );

    if (universityCount[0].count > 0) {
      throw new BadRequestException(
        'Cannot delete an institutional head that is assigned to an institution',
      );
    }

    // If admin user was created, we might want to delete it too
    if (institutionalHead.adminUserId) {
      await this.collegeDataSource.query(
        'DELETE FROM admin_users WHERE id = ?',
        [institutionalHead.adminUserId],
      );
    }

    await this.institutionalHeadRepository.remove(institutionalHead);
  }

  /**
   * Assigns an institutional head to a university/institution
   * This creates the admin_users record in edgeup_college database
   */
  async assignToInstitution(
    institutionalHeadId: number,
    universityId: number,
  ): Promise<InstitutionalHead> {
    const institutionalHead = await this.findOne(institutionalHeadId);

    // Check if university exists
    const university = await this.superadminDataSource.query(
      'SELECT * FROM universities WHERE id = ?',
      [universityId],
    );

    if (!university || university.length === 0) {
      throw new NotFoundException(`University with ID ${universityId} not found`);
    }

    // Check if university already has an institutional head
    if (university[0].institutional_head_id) {
      throw new ConflictException(
        'This university already has an institutional head assigned',
      );
    }

    let adminUserId: number;

    // Check if admin_user already exists with this email
    const existingAdminUser = await this.collegeDataSource.query(
      'SELECT id FROM admin_users WHERE email = ?',
      [institutionalHead.email],
    );

    if (existingAdminUser && existingAdminUser.length > 0) {
      // Use existing admin_user
      adminUserId = existingAdminUser[0].id;
    } else {
      // Generate a unique username
      let username = institutionalHead.email.split('@')[0];
      const existingUsername = await this.collegeDataSource.query(
        'SELECT username FROM admin_users WHERE username = ?',
        [username],
      );

      // If username exists, append a timestamp to make it unique
      if (existingUsername && existingUsername.length > 0) {
        username = `${username}_${Date.now()}`;
      }

      // Generate a default password (should be changed on first login)
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create admin_users record in edgeup_college database
      const insertResult = await this.collegeDataSource.query(
        `INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          username,
          institutionalHead.email,
          hashedPassword,
          institutionalHead.name,
          'Admin', // Default role for institutional head
          1, // is_active
        ],
      );

      adminUserId = insertResult.insertId;
    }

    // Update institutional_heads table with admin_user_id
    institutionalHead.adminUserId = adminUserId;
    await this.institutionalHeadRepository.save(institutionalHead);

    // Update universities table with institutional_head_id
    await this.superadminDataSource.query(
      'UPDATE universities SET institutional_head_id = ? WHERE id = ?',
      [institutionalHeadId, universityId],
    );

    return institutionalHead;
  }

  /**
   * Unassigns an institutional head from a university
   */
  async unassignFromInstitution(
    institutionalHeadId: number,
    universityId: number,
  ): Promise<InstitutionalHead> {
    const institutionalHead = await this.findOne(institutionalHeadId);

    // Update universities table
    await this.superadminDataSource.query(
      'UPDATE universities SET institutional_head_id = NULL WHERE id = ? AND institutional_head_id = ?',
      [universityId, institutionalHeadId],
    );

    // Optionally: Keep or delete the admin_users record
    // For now, we'll keep it but could add logic to delete if not assigned to any institution

    return institutionalHead;
  }
}
