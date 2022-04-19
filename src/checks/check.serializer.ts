import { Check } from 'src/entities/Check';
import { GetAllChecksDtoQS } from './dto/getAll-check.dto';

const serializerCheckForDB = async (check: Check) => ({
  id: check.id,
  dateTime: check.dateTime,
  kassir: check.userFK.fio,
  totalSum: check.totalSum,
  bonusPop: check.bonusCount,
  paidedCheck: check.paid,
  changedCheck: check.changedCheck,
});

const serializerCheckFromQS = (check: GetAllChecksDtoQS) => ({
  page: +check.page,
  pageSize: +check.pageSize,
  changedShow: check.changedShow === 'true' ? true : false, // был ли чек редактирован
  delayedShow: check.delayedShow === 'true' ? true : false, // был ли чек отложен
  dateStart: check?.dateStart,
  dateEnd: check?.dateEnd,
});

export { serializerCheckForDB, serializerCheckFromQS };
