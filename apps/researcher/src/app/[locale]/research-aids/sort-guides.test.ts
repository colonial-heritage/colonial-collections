import {ResearchGuide} from '@colonial-collections/api';
import {sortByPositionAndName, sortResearchGuide} from './sort-guides';

describe('sortByPositionAndName', () => {
  it('sorts items by their names when no position is provided', () => {
    const items = [
      {id: '2', name: 'Beta'},
      {id: '1', name: 'Alpha'},
      {id: '3', name: 'Gamma'},
    ];

    const expected = [
      {id: '1', name: 'Alpha'},
      {id: '2', name: 'Beta'},
      {id: '3', name: 'Gamma'},
    ];

    const result = sortByPositionAndName(items);
    expect(result).toEqual(expected);
  });

  it('sorts items by position first, then alphabetically', () => {
    const items = [
      {id: '2', name: 'Beta', position: 3},
      {id: '1', name: 'Alpha', position: 1},
      {id: '3', name: 'Gamma'},
      {id: '4', name: 'Delta', position: 2},
      {id: '5', name: 'Echo'},
    ];

    const expected = [
      {id: '1', name: 'Alpha', position: 1},
      {id: '4', name: 'Delta', position: 2},
      {id: '2', name: 'Beta', position: 3},
      {id: '5', name: 'Echo'},
      {id: '3', name: 'Gamma'},
    ];

    const result = sortByPositionAndName(items);
    expect(result).toEqual(expected);
  });

  it('handles items with missing names', () => {
    const items = [
      {id: '2', name: 'Beta'},
      {id: '1'},
      {id: '3', name: 'Gamma'},
    ];

    const expected = [
      {id: '1'},
      {id: '2', name: 'Beta'},
      {id: '3', name: 'Gamma'},
    ];

    const result = sortByPositionAndName(items);
    expect(result).toEqual(expected);
  });

  it('handles empty arrays', () => {
    const items: {id: string; name?: string; position?: number}[] = [];
    const expected: {id: string; name?: string; position?: number}[] = [];

    const result = sortByPositionAndName(items);
    expect(result).toEqual(expected);
  });

  it('handles mixed position and no position items', () => {
    const items = [
      {id: '1', name: 'Zulu', position: 2},
      {id: '2', name: 'Alpha', position: 1},
      {id: '3', name: 'Gamma'},
      {id: '4', name: 'Beta'},
    ];

    const expected = [
      {id: '2', name: 'Alpha', position: 1},
      {id: '1', name: 'Zulu', position: 2},
      {id: '4', name: 'Beta'},
      {id: '3', name: 'Gamma'},
    ];

    const result = sortByPositionAndName(items);
    expect(result).toEqual(expected);
  });
});

describe('sortResearchGuide', () => {
  it('sorts a simple guide with hasParts', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      hasParts: [
        {id: '2', name: 'Beta'},
        {id: '1', name: 'Alpha'},
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      hasParts: [
        {id: '1', name: 'Alpha'},
        {id: '2', name: 'Beta'},
      ],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });

  it('handles empty hasParts arrays', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      hasParts: [],
    };

    const expected: ResearchGuide = {
      id: 'top',
      hasParts: [],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });

  it('sorts nested hasParts arrays', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      hasParts: [
        {
          id: '1',
          name: 'Alpha',
          hasParts: [
            {id: '3', name: 'Gamma'},
            {id: '2', name: 'Beta'},
          ],
        },
        {
          id: '2',
          name: 'Beta',
          hasParts: [
            {id: '5', name: 'Epsilon'},
            {id: '4', name: 'Delta'},
          ],
        },
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      hasParts: [
        {
          id: '1',
          name: 'Alpha',
          hasParts: [
            {id: '2', name: 'Beta'},
            {id: '3', name: 'Gamma'},
          ],
        },
        {
          id: '2',
          name: 'Beta',
          hasParts: [
            {id: '4', name: 'Delta'},
            {id: '5', name: 'Epsilon'},
          ],
        },
      ],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });

  it('sorts deeply nested structures (3 levels)', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      hasParts: [
        {
          id: '1',
          name: 'Level1-B',
          hasParts: [
            {
              id: '2',
              name: 'Level2-Z',
              hasParts: [
                {id: '3', name: 'Level3-Beta'},
                {id: '4', name: 'Level3-Alpha'},
              ],
            },
            {id: '5', name: 'Level2-Alpha'},
          ],
        },
        {id: '6', name: 'Level1-A'},
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      hasParts: [
        {id: '6', name: 'Level1-A'},
        {
          id: '1',
          name: 'Level1-B',
          hasParts: [
            {id: '5', name: 'Level2-Alpha'},
            {
              id: '2',
              name: 'Level2-Z',
              hasParts: [
                {id: '4', name: 'Level3-Alpha'},
                {id: '3', name: 'Level3-Beta'},
              ],
            },
          ],
        },
      ],
    };

    const result = sortResearchGuide(topLevel);
    expect(result).toEqual(expected);
  });
});
