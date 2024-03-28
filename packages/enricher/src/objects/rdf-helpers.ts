import {ontologyVersionIdentifier, ontologyUrl} from '../definitions';
import {
  HeritageObjectEnrichment,
  HeritageObjectEnrichmentType,
} from './definitions';
import {
  createAgents,
  createDates,
  getPropertyValue,
  onlyOne,
} from '../rdf-helpers';
import {defu} from 'defu';
import type {Resource} from 'rdf-object';

export function fromTypeToClass(type: HeritageObjectEnrichmentType) {
  const entries = Object.entries(HeritageObjectEnrichmentType);
  for (const [key, value] of entries) {
    if (type === value) {
      return `${ontologyUrl}${key}${ontologyVersionIdentifier}`;
    }
  }

  throw new TypeError(`Unknown type: "${type}"`);
}

function fromClassToType(className: string | undefined) {
  const entries = Object.entries(HeritageObjectEnrichmentType);
  for (const [key, value] of entries) {
    if (className === `${ontologyUrl}${key}${ontologyVersionIdentifier}`) {
      return value;
    }
  }

  // TBD: an error is too severe if a nanopub is published by
  // another application and consumed by the Data Hub, but that
  // application doesn't use the same model as the hub.
  throw new TypeError(`Unknown class name: "${className}"`);
}

export function toHeritageObjectEnrichment(rawEnrichment: Resource) {
  const additionalType = getPropertyValue(rawEnrichment, 'ex:additionalType');
  const about = getPropertyValue(rawEnrichment, 'ex:isPartOf')!;
  const creator = onlyOne(createAgents(rawEnrichment, 'ex:creator'))!;
  const license = getPropertyValue(rawEnrichment, 'ex:license')!;
  const dateCreated = onlyOne(createDates(rawEnrichment, 'ex:dateCreated'))!;

  const enrichment: HeritageObjectEnrichment = {
    id: rawEnrichment.value,
    type: fromClassToType(additionalType),
    about,
    pubInfo: {
      creator,
      license,
      dateCreated,
    },
  };

  const citation = getPropertyValue(rawEnrichment, 'ex:citation');
  if (citation !== undefined) {
    enrichment.citation = citation;
  }

  const description = getPropertyValue(rawEnrichment, 'ex:description');
  if (description !== undefined) {
    enrichment.description = description;
  }

  const inLanguage = getPropertyValue(rawEnrichment, 'ex:inLanguage');
  if (inLanguage !== undefined) {
    enrichment.inLanguage = inLanguage;
  }

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
