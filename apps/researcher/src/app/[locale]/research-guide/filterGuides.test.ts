import {ResearchGuide} from '@colonial-collections/api/src/research-guides/definitions';
import {filterLevel3Guides, sortResearchGuide} from './filterGuides';

describe('filterLevel3Guides', () => {
  it('filters out level 1 and level 2 guides from level 3 list', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [{id: 'level3-1'}, {id: 'level1-2'}, {id: 'level2-2'}],
            },
          ],
        },
        {id: 'level1-2'},
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [{id: 'level3-1'}],
            },
          ],
        },
        {id: 'level1-2'},
      ],
    };

    const result = filterLevel3Guides(topLevel);
    expect(result).toEqual(expected);
  });

  it('handles cases with no level 3 guides', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [{id: 'level1-2'}, {id: 'level2-2'}],
            },
          ],
        },
        {id: 'level1-2'},
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [],
            },
          ],
        },
        {id: 'level1-2'},
      ],
    };

    const result = filterLevel3Guides(topLevel);
    expect(result).toEqual(expected);
  });

  it('handles cases with no seeAlso arrays', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [],
    };

    const expected: ResearchGuide = {
      id: 'top',
      seeAlso: [],
    };

    const result = filterLevel3Guides(topLevel);
    expect(result).toEqual(expected);
  });
});

describe('sortResearchGuide', () => {
  it('sorts guides by their names', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {id: '2', name: 'Beta'},
        {id: '1', name: 'Alpha'},
        {id: '3', name: 'Gamma'},
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {id: '1', name: 'Alpha'},
        {id: '2', name: 'Beta'},
        {id: '3', name: 'Gamma'},
      ],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });

  it('handles guides with missing names', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [{id: '2', name: 'Beta'}, {id: '1'}, {id: '3', name: 'Gamma'}],
    };

    const expected: ResearchGuide = {
      id: 'top',
      seeAlso: [{id: '1'}, {id: '2', name: 'Beta'}, {id: '3', name: 'Gamma'}],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });

  it('handles empty seeAlso arrays', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [],
    };

    const expected: ResearchGuide = {
      id: 'top',
      seeAlso: [],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });

  it('sorts nested seeAlso arrays', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: '1',
          name: 'Alpha',
          seeAlso: [
            {id: '3', name: 'Gamma'},
            {id: '2', name: 'Beta'},
          ],
        },
        {
          id: '2',
          name: 'Beta',
          seeAlso: [
            {id: '5', name: 'Epsilon'},
            {id: '4', name: 'Delta'},
          ],
        },
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: '1',
          name: 'Alpha',
          seeAlso: [
            {id: '2', name: 'Beta'},
            {id: '3', name: 'Gamma'},
          ],
        },
        {
          id: '2',
          name: 'Beta',
          seeAlso: [
            {id: '4', name: 'Delta'},
            {id: '5', name: 'Epsilon'},
          ],
        },
      ],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });
});
