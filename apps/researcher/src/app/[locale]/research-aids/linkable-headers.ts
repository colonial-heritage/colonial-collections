export function textToSlug(text = ''): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except space and dash
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-'); // Collapse multiple dashes
}

export function getMarkdownHeaders(
  markdown?: string
): {name: string; slug: string}[] {
  if (!markdown) return [];
  // Match lines starting with 1 to 3 #, followed by a space, then capture the header text
  const headerRegex = /^(?!#\s*$)(#{1,3})\s+(.+?)$/gm;
  const headers: {name: string; slug: string}[] = [];
  let match: RegExpExecArray | null;
  while ((match = headerRegex.exec(markdown)) !== null) {
    const name = match[2].trim();
    headers.push({name, slug: textToSlug(name)});
  }
  return headers;
}
