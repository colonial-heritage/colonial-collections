import {HeritageObjectEnrichmentType} from './definitions';
import {fromClassToType, fromTypeToClass} from './helpers';
import {ontologyUrl, ontologyVersionIdentifier} from '../definitions';
import {describe, expect, it} from '@jest/globals';

describe('fromClassToType', () => {
  it('throws if the type is unknown', () => {
    expect(() => fromClassToType('badValue')).toThrow(
      'Unknown class: "badValue"'
    );
  });

  it('returns the type of a class', () => {
    const type = fromClassToType(
      `${ontologyUrl}Material${ontologyVersionIdentifier}`
    );

    expect(type).toEqual(HeritageObjectEnrichmentType.Material);
  });
});

describe('fromTypeToClass', () => {
  it('throws if the class is unknown', () => {
    // @ts-expect-error:TS2345
    expect(() => fromTypeToClass('badValue')).toThrow(
      'Unknown type: "badValue"'
    );
  });

  it('returns the class of a type', () => {
    const className = fromTypeToClass(HeritageObjectEnrichmentType.Material);

    expect(className).toEqual(
      `${ontologyUrl}Material${ontologyVersionIdentifier}`
    );
  });
});
