import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ManagementService {
  constructor(
    @Inject('DATA_SOURCE')
    private collegeDataSource: DataSource,
    @Inject('SUPERADMIN_DATA_SOURCE')
    private superadminDataSource: DataSource,
  ) {}

  async getAdminInstitution(adminUserId: number) {
    // Step 1: Find the institutional_head record for this admin_user_id
    const institutionalHead = await this.superadminDataSource.query(
      'SELECT * FROM institutional_heads WHERE admin_user_id = ? LIMIT 1',
      [adminUserId],
    );

    if (!institutionalHead || institutionalHead.length === 0) {
      throw new NotFoundException(
        'No institutional head profile found for this admin user',
      );
    }

    const headId = institutionalHead[0].id;

    // Step 2: Find the university assigned to this institutional head
    const university = await this.superadminDataSource.query(
      'SELECT * FROM universities WHERE institutional_head_id = ? LIMIT 1',
      [headId],
    );

    if (!university || university.length === 0) {
      throw new NotFoundException(
        'No institution assigned to this institutional head',
      );
    }

    return {
      id: university[0].id,
      name: university[0].name,
      code: university[0].code,
      institutionType: university[0].institution_type,
      collegeType: university[0].college_type,
      location: university[0].location,
      establishedYear: university[0].established_year,
      description: university[0].description,
      institutionalHead: {
        id: institutionalHead[0].id,
        name: institutionalHead[0].name,
        email: institutionalHead[0].email,
        phone: institutionalHead[0].phone,
      },
    };
  }

  async getDashboardStats(adminUserId: number) {
    // First, get the institution to know which campus/institution we're dealing with
    const institution = await this.getAdminInstitution(adminUserId);

    // TODO: Add queries to get actual stats based on the institution
    // For now, return basic structure with zeros
    return {
      totalStudents: 0,
      totalTeachers: 0,
      attendanceRate: 0,
      activeClasses: 0,
      institution: {
        id: institution.id,
        name: institution.name,
      },
    };
  }
}
