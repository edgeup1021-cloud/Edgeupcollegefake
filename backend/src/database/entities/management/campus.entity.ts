import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mgmt_campuses')
export class Campus {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', name: 'contact_email', length: 255, nullable: true })
  contactEmail: string | null;

  @Column({ type: 'varchar', name: 'contact_phone', length: 50, nullable: true })
  contactPhone: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
