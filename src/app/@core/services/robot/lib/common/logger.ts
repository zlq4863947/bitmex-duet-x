export let logger = {
  on: (ev: string, fn: (e: Error) => void) => {},
  info: (msg: string) => console.log(msg),
  debug: (msg: string) => console.debug(msg),
  error: (msg: string) => console.error(msg),
};
