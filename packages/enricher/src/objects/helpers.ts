import {ontologyVersionIdentifier, ontologyUrl} from '../definitions';
import {HeritageObjectEnrichmentType} from './definitions';

// E.g. from 'material' to 'https://data.colonialcollections.nl/schemas/nanopub#material'
export function fromTypeToProperty(type: HeritageObjectEnrichmentType) {
  const entries = Object.entries(HeritageObjectEnrichmentType);
  for (const entry of entries) {
    if (type === entry[1]) {
      return `${ontologyUrl}${type}`;
    }
  }

  throw new TypeError(`Unknown type: "${type}"`);
}

// E.g. from 'https://data.colonialcollections.nl/schemas/nanopub#material' to 'material'
export function fromPropertyToType(property: string | undefined) {
  const entries = Object.entries(HeritageObjectEnrichmentType);
  for (const entry of entries) {
    if (property === `${ontologyUrl}${entry[1]}`) {
      return entry[1];
    }
  }

  // This error can be thrown if an external app has published a nanopub for
  // inclusion into the Datahub without adhering to its data model
  throw new TypeError(`Unknown property: "${property}"`);
}

// E.g. from 'material' to 'https://data.colonialcollections.nl/schemas/nanopub#MaterialVersion1'
export function fromTypeToClass(type: HeritageObjectEnrichmentType) {
  const entries = Object.entries(HeritageObjectEnrichmentType);
  for (const [key, value] of entries) {
    if (type === value) {
      return `${ontologyUrl}${key}${ontologyVersionIdentifier}`;
    }
  }

  throw new TypeError(`Unknown type: "${type}"`);
}
