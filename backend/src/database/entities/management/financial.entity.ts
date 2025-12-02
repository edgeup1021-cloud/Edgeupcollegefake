import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mgmt_financials')
export class Financial {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ name: 'tuition_income', type: 'decimal', precision: 15, scale: 2, default: 0 })
  tuitionIncome: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  grants: number;

  @Column({ name: 'operational_expenses', type: 'decimal', precision: 15, scale: 2, default: 0 })
  operationalExpenses: number;

  @Column({ name: 'salaries_expenses', type: 'decimal', precision: 15, scale: 2, default: 0 })
  salariesExpenses: number;

  // surplus_deficit is a GENERATED column in MySQL, we'll calculate it in code
  get surplusDeficit(): number {
    return (
      Number(this.tuitionIncome) +
      Number(this.grants) -
      Number(this.operationalExpenses) -
      Number(this.salariesExpenses)
    );
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
