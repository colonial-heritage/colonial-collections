import {ResearchGuide} from '@colonial-collections/api';

/**
 * Filters out level 1 and level 2 guides from the seeAlso arrays of level 2 guides.
 *
 * Assumptions:
 * - topLevel.seeAlso contains level 1 guides.
 * - Each level 1 guide's seeAlso contains level 2 guides.
 * - Each level 2 guide's seeAlso may contain level 1, level 2, and level 3 guides.
 */
export function filterLevel3Guides(topLevel: ResearchGuide): ResearchGuide {
  topLevel.seeAlso?.forEach(level1Guide => {
    level1Guide.seeAlso?.forEach(level2Guide => {
      const filteredSeeAlso =
        level2Guide.seeAlso?.filter(guide => {
          // Check if the guide is a level 1 guide
          const isLevel1Guide = topLevel.seeAlso?.some(
            l1 => l1.id === guide.id
          );
          // Check if the guide is a level 2 guide
          const isLevel2Guide = topLevel.seeAlso?.some(
            l1 => l1.seeAlso?.some(l2 => l2.id === guide.id)
          );

          // If the guide is not a level 1 or level 2 guide, it's a level 3 guide
          return !isLevel1Guide && !isLevel2Guide;
        }) || [];
      level2Guide.seeAlso = filteredSeeAlso;
    });
  });

  return topLevel;
}

export function sortResearchGuide(topLevel: ResearchGuide): ResearchGuide {
  const sortGuides = (guide: ResearchGuide): ResearchGuide => {
    const sortedSeeAlso =
      guide.seeAlso?.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ) || [];

    return {
      ...guide,
      seeAlso: sortedSeeAlso.map(sortGuides),
    };
  };

  return sortGuides(topLevel);
}
