import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ default: 'now', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ default: 'now', type: 'timestamptz' })
  updatedAt: Date;
}
