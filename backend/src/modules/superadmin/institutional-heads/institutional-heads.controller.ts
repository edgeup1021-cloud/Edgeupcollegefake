import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InstitutionalHeadsService } from './institutional-heads.service';
import {
  CreateInstitutionalHeadDto,
  UpdateInstitutionalHeadDto,
} from './dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('institutional-heads')
export class InstitutionalHeadsController {
  constructor(
    private readonly institutionalHeadsService: InstitutionalHeadsService,
  ) {}

  @Public()
  @Post()
  create(@Body() createInstitutionalHeadDto: CreateInstitutionalHeadDto) {
    return this.institutionalHeadsService.create(createInstitutionalHeadDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.institutionalHeadsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.institutionalHeadsService.findOne(id);
  }

  @Public()
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstitutionalHeadDto: UpdateInstitutionalHeadDto,
  ) {
    return this.institutionalHeadsService.update(id, updateInstitutionalHeadDto);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.institutionalHeadsService.remove(id);
  }
}
