import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountCurrency, AccountStatus, AccountType } from '../shered';
import { User } from '../../users/entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  accountNumber: string;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.Saving })
  accountType: string;

  @Column({ type: 'enum', enum: AccountCurrency, default: AccountCurrency.BRL })
  currency: string;

  @Column({ type: 'bigint', default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.Active })
  status: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
