import {ResearchGuide} from '@colonial-collections/api';
import {sortResearchGuide} from './sort-guides';

describe('sortResearchGuide', () => {
  it('sorts guides by their names', () => {
    const topLevel: ResearchGuide = {
      id: 'top',
      hasParts: [
        {id: '2', name: 'Beta'},
        {id: '1', name: 'Alpha'},
        {id: '3', name: 'Gamma'},
      ],
    };

    const expected: ResearchGuide = {
      id: 'top',
      hasParts: [
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
      hasParts: [{id: '2', name: 'Beta'}, {id: '1'}, {id: '3', name: 'Gamma'}],
    };

    const expected: ResearchGuide = {
      id: 'top',
      hasParts: [{id: '1'}, {id: '2', name: 'Beta'}, {id: '3', name: 'Gamma'}],
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
});
