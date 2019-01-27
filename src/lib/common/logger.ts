import elog from 'electron-log';

import { isElectron } from '../../app/@core/functions';

export class Log {
  elog: typeof elog;

  constructor() {
    if (isElectron()) {
      this.elog = window.require('electron').remote.require('electron-log');
    } else {
      this.elog = <any>console;
    }
  }

  info(msg: string): void {
    this.elog.info(msg);
  }

  debug(msg: string): void {
    this.elog.debug(msg);
  }

  error(msg: string): void {
    this.elog.error(msg);
  }
}
