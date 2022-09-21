import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  error: boolean;

  @Column()
  identifier: string;

  @Column({ nullable: true })
  notificationId: number;
}
