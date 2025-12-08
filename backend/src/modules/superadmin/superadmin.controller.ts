import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { CreateSuperadminDto, UpdateSuperadminDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Public()
  @Post()
  create(@Body() createSuperadminDto: CreateSuperadminDto) {
    return this.superadminService.create(createSuperadminDto);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN)
  findAll() {
    return this.superadminService.findAll();
  }

  @Get('overview')
  @Roles(UserRole.SUPERADMIN)
  async getOverview(@CurrentUser() user: any) {
    return this.superadminService.getOverview(user.sub);
  }

  @Get('dashboard')
  @Roles(UserRole.SUPERADMIN)
  async getDashboard(@CurrentUser() user: any) {
    return this.superadminService.getDashboard(user.sub);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.superadminService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateSuperadminDto: UpdateSuperadminDto) {
    return this.superadminService.update(+id, updateSuperadminDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.superadminService.remove(+id);
  }
}
