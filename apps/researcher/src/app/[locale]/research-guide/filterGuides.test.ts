import {filterLevel3Guides, sortLevel1Guides} from './filterGuides';

describe('filterLevel3Guides', () => {
  it('only shows each level 3 guide once', () => {
    const topLevel = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [{id: 'level3-1'}, {id: 'level3-2'}, {id: 'level3-3'}],
            },
            {
              id: 'level2-2',
              seeAlso: [{id: 'level3-1'}, {id: 'level3-4'}],
            },
          ],
        },
        {
          id: 'level1-2',
          seeAlso: [
            {
              id: 'level2-3',
              seeAlso: [{id: 'level3-2'}, {id: 'level3-5'}],
            },
          ],
        },
      ],
    };

    const filteredTopLevel = filterLevel3Guides(topLevel);

    expect(filteredTopLevel.seeAlso?.[0].seeAlso?.[0].seeAlso).toEqual([]);
    expect(filteredTopLevel.seeAlso?.[0].seeAlso?.[1].seeAlso).toEqual([]);
    expect(filteredTopLevel.seeAlso?.[1].seeAlso?.[0].seeAlso).toEqual([
      {id: 'level3-2'},
      {id: 'level3-5'},
    ]);
  });

  it('filters out level 1 and 2 guides from the level 2 seeAlso', () => {
    const topLevel = {
      id: 'top',
      seeAlso: [
        {
          id: 'level1-1',
          seeAlso: [
            {
              id: 'level2-1',
              seeAlso: [
                {id: 'level1-2'}, // Level 1 guide
                {id: 'level2-2'}, // Level 2 guide
                {id: 'level3-1'}, // Level 3 guide
              ],
            },
          ],
        },
        {
          id: 'level1-2',
          seeAlso: [
            {
              id: 'level2-2',
              seeAlso: [
                {id: 'level3-2'}, // Level 3 guide
              ],
            },
          ],
        },
      ],
    };

    const filteredTopLevel = filterLevel3Guides(topLevel);

    expect(filteredTopLevel.seeAlso?.[0].seeAlso?.[0].seeAlso).toEqual([]);
    expect(filteredTopLevel.seeAlso?.[1].seeAlso?.[0].seeAlso).toEqual([
      {id: 'level3-2'},
    ]);
  });
});

describe('sortLevel1Guides', () => {
  it('sorts level 1 guides by their names', () => {
    const topLevel = {
      id: 'top',
      seeAlso: [
        {id: '2', name: 'B'},
        {id: '1', name: 'A'},
        {id: '3', name: 'C'},
      ],
    };

    const sortedLevel1Guides = sortLevel1Guides(topLevel);

    expect(sortedLevel1Guides).toEqual([
      {id: '1', name: 'A'},
      {id: '2', name: 'B'},
      {id: '3', name: 'C'},
    ]);
  });
});
