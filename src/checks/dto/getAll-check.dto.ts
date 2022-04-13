export class GetAllChecksDto {
  page: number;
  pageSize: number;
  changedShow?: boolean; // был ли чек редактирован
  delayedShow: boolean; // был ли чек отложен
  dateStart?: Date;
  dateEnd?: Date;
}
