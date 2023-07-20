export function encodeRouteSegment(routeSegment: string) {
  // If the dynamic routes segments contain dots, the Clerk middleware will throw an error, so encode the dots.
  return encodeURIComponent(routeSegment.replaceAll('.', '%2E'));
}

export function decodeRouteSegment(routeSegment: string) {
  return decodeURIComponent(routeSegment).replaceAll('%2E', '.');
}
