export async function search<T>(
  endpointUrl: string,
  searchRequest: Record<string, unknown>
): Promise<T> {
  const response = await fetch(endpointUrl, {
    method: 'POST',
    body: JSON.stringify(searchRequest),
    headers: {'Content-Type': 'application/json'},
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve information: ${response.statusText} (${response.status})`
    );
  }

  return response.json();
}
