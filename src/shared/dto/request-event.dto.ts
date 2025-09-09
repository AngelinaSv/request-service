import { RequestStatus } from '../enums/request-status.enum';

export class RequestEventDto {
  id: number;
  status: RequestStatus;
}
