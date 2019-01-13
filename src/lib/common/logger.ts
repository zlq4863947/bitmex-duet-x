import * as moment from 'moment';

export const logger = {
  on: (ev: string, fn: (e: Error) => void) => {},
  info: (msg: string) => console.log(`[${moment().format()}]`, msg),
  debug: (msg: string) => console.debug(`[${moment().format()}]`, msg),
  error: (msg: string) => console.error(`[${moment().format()}]`, msg),
};
