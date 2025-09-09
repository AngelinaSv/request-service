import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestStatus } from 'src/shared/enums/request-status.enum';
import { RequestEventDto } from 'src/shared/dto/request-event.dto';
import { Inject } from '@nestjs/common';
import { RequestEntity } from './entities';

@Injectable()
export class WorkerService {
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
    @InjectRepository(RequestEntity)
    private requestsRepository: Repository<RequestEntity>,
  ) {}

  async handleUpdateStatus(payload: RequestEventDto) {
    try {
      const request = await this.requestsRepository.findOneBy({
        id: payload.id,
      });

      if (!request) {
        return;
      }

      if (request.status === RequestStatus.DONE) {
        return;
      }

      let newStatus: RequestStatus;

      switch (request.status) {
        case RequestStatus.NEW:
          newStatus = RequestStatus.IN_PROGRESS;
          break;
        case RequestStatus.IN_PROGRESS:
          newStatus = RequestStatus.DONE;
          break;
      }

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => {
        request.status = newStatus;
        await this.requestsRepository.save(request);

        console.log('Status updated to', newStatus);

        if (newStatus !== RequestStatus.DONE) {
          this.client.emit('process_request', {
            id: request.id,
            status: newStatus,
          });
        }
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  }
}
