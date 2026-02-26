export type ResolvedImage = {
  id: string;
  contentUrl: string;
  license?: {id: string; name?: string};
};

interface LinkedArtResource {
  '@context'?: string;
  id?: string;
  type?: string;
  shows?: Array<{id: string}>;
  digitally_shown_by?: Array<{id: string}>;
  access_point?: Array<{id: string}>;
  subject_to?: Array<{classified_as?: Array<{id: string}>}>;
}

export async function resolveLinkedArtImages(
  mainEntityOfPageUrl: string
): Promise<ResolvedImage[]> {
  try {
    // Level 1: Fetch the main object
    const objectData = await fetchLinkedArt(mainEntityOfPageUrl);
    if (!objectData) {
      return [];
    }

    const shows: {id: string}[] = objectData.shows ?? [];
    if (shows.length === 0) {
      return [];
    }

    // Level 2: Fetch all VisualItems in parallel
    const visualItems = await Promise.all(
      shows.map(ref => fetchLinkedArt(ref.id))
    );

    // Collect all DigitalObject references with their associated license
    const digitalObjectRefs: {id: string; license?: {id: string}}[] = [];

    for (const visualItem of visualItems) {
      if (!visualItem) {
        continue;
      }

      const license = extractLicense(visualItem);
      const digitalObjects: {id: string}[] =
        visualItem.digitally_shown_by ?? [];

      for (const digitalObject of digitalObjects) {
        digitalObjectRefs.push({
          id: digitalObject.id,
          ...(license ? {license} : {}),
        });
      }
    }

    if (digitalObjectRefs.length === 0) {
      return [];
    }

    // Level 3: Fetch all DigitalObjects in parallel
    const digitalObjectResults = await Promise.all(
      digitalObjectRefs.map(async ref => {
        const data = await fetchLinkedArt(ref.id);
        if (!data) {
          return null;
        }

        const accessPoints: {id: string}[] = data.access_point ?? [];
        if (accessPoints.length === 0) {
          return null;
        }

        const image: ResolvedImage = {
          id: ref.id,
          contentUrl: accessPoints[0].id,
        };

        if (ref.license) {
          image.license = ref.license;
        }

        return image;
      })
    );

    return digitalObjectResults.filter(
      (image): image is ResolvedImage => image !== null
    );
  } catch {
    return [];
  }
}

async function fetchLinkedArt(url: string): Promise<LinkedArtResource | null> {
  try {
    const response = await fetch(url, {
      headers: {Accept: 'application/ld+json'},
    });

    if (!response.ok) return null;

    const data: LinkedArtResource = await response.json();

    // Validate that this is a Linked Art response
    const context = data['@context'];
    if (typeof context !== 'string' || !context.includes('linked.art')) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function extractLicense(
  visualItem: LinkedArtResource
): {id: string} | undefined {
  const subjectTo = visualItem.subject_to ?? [];

  for (const right of subjectTo) {
    const classifiedAs: {id: string}[] = right.classified_as ?? [];
    if (classifiedAs.length > 0) {
      return {id: classifiedAs[0].id};
    }
  }

  return undefined;
}
