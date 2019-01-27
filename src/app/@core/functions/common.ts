import { OrderStatus } from '@duet-robot/type';

export function isElectron(): boolean {
  return window && window.process && window.process.type;
}

export function getStatusHtml(status: string) {
  let clsName;
  switch (status) {
    case '已成交': {
      clsName = 'cell_success';
      break;
    }
    case '已取消': {
      clsName = 'cell_fail';
      break;
    }
  }
  return `<div class="${clsName}">${status}</div>`;
}

export function getStatusName(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Filled: {
      return '已成交';
    }
    case OrderStatus.Canceled: {
      return '已取消';
    }
    case OrderStatus.New: {
      return '已委托';
    }
    case OrderStatus.PartiallyFilled: {
      return '部分成交';
    }
    case OrderStatus.Rejected: {
      return '已拒绝';
    }
    default: {
      return '未知状态';
    }
  }
}
