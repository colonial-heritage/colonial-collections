type Guide = {
  id: string;
  name?: string;
  seeAlso?: Guide[];
};

/**
 * Filters out level 1 and level 2 guides from the seeAlso arrays of level 2 guides
 * and ensures each level 3 guide is only shown once.
 *
 * Assumptions:
 * - topLevel.seeAlso contains level 1 guides.
 * - Each level 1 guide's seeAlso contains level 2 guides.
 * - Each level 2 guide's seeAlso may contain level 1, level 2, and level 3 guides.
 * - Level 3 guides should only be shown once across all level 2 guides.
 * - The first level 1 guide only shows the level 2 guides.
 */
export const filterLevel3Guides = (topLevel: Guide): Guide => {
  const displayedLevel3Guides = new Set<string>();

  // For the first level 1 guide only the level 2 guides should be displayed
  if (topLevel.seeAlso && topLevel.seeAlso[0]) {
    topLevel.seeAlso[0].seeAlso = topLevel.seeAlso[0].seeAlso?.map(guide => {
      guide.seeAlso = undefined;
      return guide;
    });
  }

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

          // If the guide is not a level 1 or level 2 guide and has not been displayed yet, it's a level 3 guide
          if (
            !isLevel1Guide &&
            !isLevel2Guide &&
            !displayedLevel3Guides.has(guide.id)
          ) {
            displayedLevel3Guides.add(guide.id);
            return true;
          }
          return false;
        }) || [];
      level2Guide.seeAlso = filteredSeeAlso;
    });
  });

  return topLevel;
};

/**
 * Sorts the level 1 guides by their names.
 */
export const sortLevel1Guides = (topLevel: Guide): Guide[] => {
  return (
    topLevel.seeAlso?.sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    ) || []
  );
};
