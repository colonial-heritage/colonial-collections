// Linked data uses URIs as identifiers.
// To use the URIs in dynamic routes, we need to encode them first.

export function encodeUriIdentifier(uri: string) {
  return encodeURIComponent(uri.replace(/\./g, '%2E'));
}

export function decodeUriIdentifier(routeSegment: string) {
  return decodeURIComponent(routeSegment).replaceAll('%2E', '.');
}
