import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RequestStatus } from '../../shared/enums/request-status.enum';

@Entity({ name: 'requests' })
export class RequestEntity {
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
