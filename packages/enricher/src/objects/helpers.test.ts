import {HeritageObjectEnrichmentType} from './definitions';
import {
  fromPropertyToType,
  fromTypeToClass,
  fromTypeToProperty,
} from './helpers';
import {ontologyVersionIdentifier, ontologyUrl} from '../definitions';
import {describe, expect, it} from '@jest/globals';

describe('fromTypeToProperty', () => {
  it('throws if the property is unknown', () => {
    // @ts-expect-error:TS2345
    expect(() => fromTypeToProperty('badValue')).toThrow(
      'Unknown type: "badValue"'
    );
  });

  it('returns the property of a type', () => {
    const property = fromTypeToProperty(HeritageObjectEnrichmentType.Material);

    expect(property).toEqual(`${ontologyUrl}material`);
  });
});

describe('fromPropertyToType', () => {
  it('throws if the type is unknown', () => {
    expect(() => fromPropertyToType('badValue')).toThrow(
      'Unknown property: "badValue"'
    );
  });

  it('returns the type of a property', () => {
    const type = fromPropertyToType(`${ontologyUrl}material`);

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
