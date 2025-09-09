import { Controller } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RequestEventDto } from 'src/shared/dto/request-event.dto';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @EventPattern('process_request')
  async handleUpdateStatus(@Payload() data: RequestEventDto) {
    return this.workerService.handleUpdateStatus(data);
  }
}
