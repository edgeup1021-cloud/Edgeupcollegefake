import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ManagementService } from './management.service';

@Controller('management')
@UseGuards(JwtAuthGuard)
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('institution')
  async getInstitution(@CurrentUser() user: any) {
    return this.managementService.getAdminInstitution(user.id);
  }

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    return this.managementService.getDashboardStats(user.id);
  }
}
