import {ontologyVersionIdentifier, ontologyUrl} from '../definitions';
import {AdditionalType, HeritageObjectEnrichment} from './definitions';
import {getPropertyValue} from '../helpers';
import {defu} from 'defu';
import type {Resource} from 'rdf-object';

export function fromAdditionalTypeToClass(additionalType: AdditionalType) {
  const entries = Object.entries(AdditionalType);
  for (const [key, value] of entries) {
    if (additionalType === value) {
      return `${ontologyUrl}${key}${ontologyVersionIdentifier}`;
    }
  }

  throw new TypeError(`Unknown type: "${additionalType}"`);
}

function fromClassToAdditionalType(className: string | undefined) {
  const entries = Object.entries(AdditionalType);
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

export function createEnrichment(rawEnrichment: Resource) {
  const additionalType = getPropertyValue(rawEnrichment, 'ex:additionalType');
  const isPartOf = getPropertyValue(rawEnrichment, 'ex:isPartOf');
  const description = getPropertyValue(rawEnrichment, 'ex:description');
  const citation = getPropertyValue(rawEnrichment, 'ex:citation');
  const inLanguage = getPropertyValue(rawEnrichment, 'ex:inLanguage');
  const creator = getPropertyValue(rawEnrichment, 'ex:creator');
  const license = getPropertyValue(rawEnrichment, 'ex:license');

  const creatorResource = rawEnrichment.property['ex:creator'];
  const creatorName = getPropertyValue(creatorResource, 'ex:name');

  const rawDateCreated = getPropertyValue(rawEnrichment, 'ex:dateCreated');
  const dateCreated = new Date(rawDateCreated!);

  const enrichment: HeritageObjectEnrichment = {
    id: rawEnrichment.value,
    additionalType: fromClassToAdditionalType(additionalType),
    about: isPartOf!,
    description: description!,
    citation: citation!,
    inLanguage,
    creator: {
      id: creator!,
      name: creatorName!,
    },
    license: license!,
    dateCreated,
  };

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
