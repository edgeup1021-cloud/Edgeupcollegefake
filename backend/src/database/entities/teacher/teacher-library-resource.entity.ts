import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LibraryResourceCategory } from '../../../common/enums/status.enum';

@Entity('teacher_library_resources')
export class TeacherLibraryResource {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'uploaded_by', type: 'bigint', unsigned: true })
  uploadedBy: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: LibraryResourceCategory,
  })
  category: LibraryResourceCategory;

  @Column({ name: 'file_url', type: 'varchar', length: 1024 })
  fileUrl: string;

  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName: string;

  @Column({ name: 'file_size', type: 'bigint', unsigned: true, nullable: true })
  fileSize: number | null;

  @Column({ name: 'file_type', type: 'varchar', length: 100, nullable: true })
  fileType: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags: string | null;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
