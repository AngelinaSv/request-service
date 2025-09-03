import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RequestStatus } from './enums/request-status.enum';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: 'new' })
  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.NEW,
  })
  status: RequestStatus;
}
