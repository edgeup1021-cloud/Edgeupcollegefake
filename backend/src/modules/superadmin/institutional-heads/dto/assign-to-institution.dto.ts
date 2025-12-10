import { IsNumber } from 'class-validator';

export class AssignToInstitutionDto {
  @IsNumber()
  universityId: number;
}
