// To use the URIs in dynamic routes, we need to encode them first.
export function encodeUri(uri: string) {
  // If the dynamic routes segments contain dots, the Clerk middleware will throw an error, so encode the dots.
  return encodeURIComponent(uri.replaceAll('.', '%2E'));
}

export function decodeUri(encodedUri: string) {
  return decodeURIComponent(encodedUri).replaceAll('%2E', '.');
}
