import { Check } from 'src/entities/Check';
import { CheckLine } from 'src/entities/CheckLine';
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

const serializerCheckWithLineForDB = async (check: Check) => {
  const checkSer = {
    id: check.id,
    dateTime: check.dateTime,
    bonusCount: check.bonusCount,
    cardFK: check.bonusCardFK?.id || null,
    kassir: check.userFK.fio,
    paid: check.paid,
    totalSum: check.totalSum,
    parentCheckId: check?.parentCheckId || null,
  };
  const lineSer = [];
  for (const line of check.checkLines) {
    lineSer.push({
      id: line.id,
      productCount: line.productCount,
      price: line.price,
      oldProduct: line.oldProduct,
      productName: line.productFK?.manufacturerFK
        ? `${line.productFK.title}, ${line.productFK?.manufacturerFK?.title}`
        : line.productFK.title,
      maybeOld: line.productFK.maybeOld,
      sale: line.productFK.saleFK.id,
    });
  }
  return { ...checkSer, checkLines: lineSer };
};

export {
  serializerCheckForDB,
  serializerCheckFromQS,
  serializerCheckWithLineForDB,
};
