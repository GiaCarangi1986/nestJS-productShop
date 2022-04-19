import { FindOperator } from 'typeorm';

export class WhereCheckDto {
  parentCheckId: null;
  dateTime: FindOperator<Date>;
  changedCheck?: boolean; // был ли чек редактирован
  paid?: boolean; // был ли чек отложен
}
