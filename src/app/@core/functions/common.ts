export function isElectron(): boolean {
  return window && window.process && window.process.type;
}
