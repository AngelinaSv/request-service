import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './create-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { RequestEntity } from './request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
    @InjectRepository(RequestEntity)
    private requestsRepository: Repository<RequestEntity>,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<RequestEntity> {
    const entity = this.requestsRepository.create(createRequestDto);
    const request = await this.requestsRepository.save(entity);

    this.client.emit('process_request', {
      id: request.id,
      status: request.status,
    });

    return request;
  }

  async findAll(): Promise<RequestEntity[]> {
    return this.requestsRepository.find();
  }
}
