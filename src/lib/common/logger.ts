import elog from 'electron-log';

export const logger = {
  on: (ev: string, fn: (e: Error) => void) => {},
  info: (msg: string) => elog.info(msg),
  debug: (msg: string) => elog.debug(msg),
  error: (msg: string) => elog.error(msg),
};
