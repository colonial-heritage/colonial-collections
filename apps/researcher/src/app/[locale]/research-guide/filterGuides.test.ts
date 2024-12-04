import {ResearchGuide} from '@colonial-collections/api/src/research-guides/definitions';
import {filterLevel3Guides, sortResearchGuide} from './filterGuides';

describe('filterLevel3Guides', () => {
  it('should filter out level 1 and level 2 guides from level 3 list', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [
                {id: 'level3-1'},
                {id: 'level1-2'}, // This should be filtered out
                {id: 'level2-2'}, // This should be filtered out
              ],
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

  it('should handle cases with no level 3 guides', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [
                {id: 'level1-2'}, // This should be filtered out
                {id: 'level2-2'}, // This should be filtered out
              ],
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

  it('should handle cases with no seeAlso arrays', () => {
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
  it('should sort guides by their names', () => {
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

  it('should handle guides with missing names', () => {
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

  it('should handle empty seeAlso arrays', () => {
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

  it('should sort nested seeAlso arrays', () => {
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
