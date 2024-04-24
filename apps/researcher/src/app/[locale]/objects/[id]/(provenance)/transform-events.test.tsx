import {
  getTypeName,
  getMotivations,
  getQualifierName,
} from './transform-events';
import {describe, expect} from '@jest/globals';

const t = jest.fn(key => `translated: ${key}`);
jest.mock('next-intl/server', () => {
  return {
    getTranslations: () => t,
  };
});

jest.mock('@/lib/provenance-options', () => {
  return {
    typeMapping: {
      Type: {
        type: 'Type',
        additionalType: 'AdditionalType 1',
        translationKey: 'Type 1',
      },
      Type2: {
        type: 'Type',
        additionalType: 'AdditionalType 2',
        translationKey: 'Type 2',
      },
    },
    qualifierOptions: [
      {
        id: 'QualifierId',
        translationKey: 'QualifierTranslationKey',
      },
    ],
  };
});

describe('getTypeName', () => {
  it('returns the type name', async () => {
    const event = {
      additionalTypes: [
        {
          id: 'AdditionalType 1',
          name: 'Type 1',
        },
        {
          id: 'AdditionalType 2',
          name: 'Type 2',
        },
      ],
      type: 'Type',
    };

    // @ts-expect-error:TS2345
    const result = await getTypeName(event);

    expect(result).toBe('translated: Type 1, translated: Type 2');
  });

  it('returns the type name without translation', async () => {
    const event = {
      additionalTypes: [
        {
          id: 'AdditionalType 3',
          name: 'Type 3',
        },
      ],
      type: 'Type',
    };

    // @ts-expect-error:TS2345
    const result = await getTypeName(event);

    expect(result).toBe('Type 3');
  });
});

describe('getMotivations', () => {
  it('parses a YAML string', () => {
    const event = {
      description: `
      location: 'some motivation'
      startDate: '2022-01-01'
      `,
    };

    // @ts-expect-error:TS2345
    const result = getMotivations(event);

    expect(result).toEqual({
      location: 'some motivation',
      startDate: '2022-01-01',
    });
  });

  it('returns undefined when the parsed description is not an object', () => {
    const event = {
      description: 'not a YAML object',
    };

    // @ts-expect-error:TS2345
    const result = getMotivations(event);

    expect(result).toBeUndefined();
  });

  it('returns undefined when description is not provided', () => {
    const event = {};

    // @ts-expect-error:TS2345
    const result = getMotivations(event);

    expect(result).toBeUndefined();
  });
});

describe('getQualifierName', () => {
  it('returns undefined when event does not have qualifier', async () => {
    const event = {};

    // @ts-expect-error:TS2345
    const result = await getQualifierName(event);

    expect(result).toBeUndefined();
  });

  it('returns the translated qualifier name when qualifier is found in the `qualifierOptions`', async () => {
    const event = {
      qualifier: {
        id: 'QualifierId',
        name: 'Qualifier Name',
      },
    };

    // @ts-expect-error:TS2345
    const result = await getQualifierName(event);

    expect(result).toBe('translated: QualifierTranslationKey');
  });

  it('returns the qualifier name when the qualifier is not found in the `qualifierOptions`', async () => {
    const event = {
      qualifier: {
        id: 'UnknownQualifierId',
        name: 'Unknown Name',
      },
    };

    // @ts-expect-error:TS2345
    const result = await getQualifierName(event);

    expect(result).toBe(event.qualifier.name);
  });
});
