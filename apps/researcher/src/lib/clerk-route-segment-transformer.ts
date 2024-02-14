export function encodeRouteSegment(routeSegment: string) {
  return Buffer.from(routeSegment).toString('hex');
}

export function decodeRouteSegment(routeSegment: string) {
  return Buffer.from(routeSegment, 'hex').toString('utf8');
}
