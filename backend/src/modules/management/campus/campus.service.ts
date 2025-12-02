import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from '../../../database/entities/management';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async findAll(): Promise<Campus[]> {
    return this.campusRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Campus> {
    const campus = await this.campusRepository.findOne({ where: { id } });
    if (!campus) {
      throw new NotFoundException(`Campus with ID ${id} not found`);
    }
    return campus;
  }
}
