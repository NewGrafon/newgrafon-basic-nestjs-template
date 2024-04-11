export function stringToBoolean(str: string | boolean): boolean {
  return (typeof str === 'boolean' && str) || str === 'true' || str === '0';
}
