import {ResearchGuide} from '@colonial-collections/api';

export function sortResearchGuide(topLevel: ResearchGuide): ResearchGuide {
  const sortGuides = (guide: ResearchGuide): ResearchGuide => {
    const sortedParts =
      guide.hasParts?.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ) || undefined;

    return {
      ...guide,
      hasParts: sortedParts?.map(sortGuides),
    };
  };

  return sortGuides(topLevel);
}
