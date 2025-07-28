import {ResearchGuide} from '@colonial-collections/api';

interface SortableItem {
  position?: number;
  name?: string;
}

export function sortByPositionAndName<T extends SortableItem>(items: T[]): T[] {
  return items.sort((a, b) => {
    // Sort by position first (if both have position)
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    // If only one has position, prioritize it
    if (a.position !== undefined) return -1;
    if (b.position !== undefined) return 1;
    // If neither has position, sort alphabetically
    return (a.name || '').localeCompare(b.name || '');
  });
}

export function sortResearchGuide(topLevel: ResearchGuide) {
  const sortGuides = (guide: ResearchGuide): ResearchGuide => {
    const sortedParts = guide.hasParts
      ? sortByPositionAndName(guide.hasParts)
      : undefined;

    return {
      ...guide,
      hasParts: sortedParts?.map(sortGuides),
    };
  };

  return sortGuides(topLevel);
}
