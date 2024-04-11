import {ontologyVersionIdentifier, ontologyUrl} from '../definitions';
import {HeritageObjectEnrichmentType} from './definitions';

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

// E.g. from 'https://data.colonialcollections.nl/schemas/nanopub#MaterialVersion1' to 'material'
export function fromClassToType(className: string | undefined) {
  const entries = Object.entries(HeritageObjectEnrichmentType);
  for (const [key, value] of entries) {
    if (className === `${ontologyUrl}${key}${ontologyVersionIdentifier}`) {
      return value;
    }
  }

  // This error can be thrown if an external app has published a nanopub for
  // inclusion into the Datahub without adhering to its data model
  throw new TypeError(`Unknown class: "${className}"`);
}
