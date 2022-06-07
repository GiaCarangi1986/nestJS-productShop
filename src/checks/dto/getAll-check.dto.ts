import { FindOperator } from 'typeorm';

export class GetAllChecksDto {
  page: number;
  pageSize: number;
  changedShow?: boolean; // был ли чек редактирован
  delayedShow: boolean; // был ли чек отложен
  dateStart?: Date;
  dateEnd?: Date;
}

export class GetAllChecksDtoQS {
  page: string;
  pageSize: string;
  changedShow?: string; // был ли чек редактирован
  delayedShow: string; // был ли чек отложен
  dateStart?: Date;
  dateEnd?: Date;
}

export class WhereCheckDto {
  parentCheckId: null;
  dateTime: FindOperator<Date>;
  changedCheck?: boolean; // был ли чек редактирован
  paid?: boolean; // был ли чек отложен
  isCancelled?: boolean; // был ли чек удлаен (отменена покупка)
}

export class SerializerCheckFromQS {
  page: number;
  pageSize: number;
  changedShow: boolean; // был ли чек редактирован
  delayedShow: boolean; // был ли чек отложен
  dateStart: Date;
  dateEnd: Date;
}

export class SerializerCheckForDB {
  id: number;
  dateTime: Date;
  kassir: string;
  totalSum: number;
  bonusPop: number;
  paidedCheck: boolean;
  changedCheck: boolean;
  mayActions: boolean;
}
