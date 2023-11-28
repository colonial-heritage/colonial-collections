import {
  ontologyVersionIdentifier,
  ontologyUrl,
  AdditionalType,
  Enrichment,
} from './definitions';
import {defu} from 'defu';
import type {Resource} from 'rdf-object';

export function fromAboutTypeToClass(additionalType: AdditionalType) {
  let className;
  if (additionalType === AdditionalType.Description) {
    className = 'Description';
  } else if (additionalType === AdditionalType.Name) {
    className = 'Name';
  } else {
    throw new TypeError(`Unknown type: "${additionalType}"`);
  }

  return `${ontologyUrl}${className}${ontologyVersionIdentifier}`;
}

function fromClassToAboutType(className: string | undefined) {
  let additionalType: AdditionalType;
  if (className === `${ontologyUrl}Description${ontologyVersionIdentifier}`) {
    additionalType = AdditionalType.Description;
  } else if (className === `${ontologyUrl}Name${ontologyVersionIdentifier}`) {
    additionalType = AdditionalType.Name;
  } else {
    throw new TypeError(`Unknown class name: "${className}"`);
  }

  return additionalType;
}

function getPropertyValue(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  return property.value;
}

export function createEnrichment(rawEnrichment: Resource) {
  const additionalType = getPropertyValue(rawEnrichment, 'cc:additionalType');
  const isPartOf = getPropertyValue(rawEnrichment, 'cc:isPartOf');
  const description = getPropertyValue(rawEnrichment, 'cc:description');
  const citation = getPropertyValue(rawEnrichment, 'cc:citation');
  const inLanguage = getPropertyValue(rawEnrichment, 'cc:inLanguage');
  const creator = getPropertyValue(rawEnrichment, 'cc:creator');
  const license = getPropertyValue(rawEnrichment, 'cc:license');

  const creatorResource = rawEnrichment.property['cc:creator'];
  const creatorName = getPropertyValue(creatorResource, 'cc:name');

  const rawDateCreated = getPropertyValue(rawEnrichment, 'cc:dateCreated');
  // @ts-expect-error:TS2322
  const dateCreated = new Date(rawDateCreated);

  // Silence TS errors about 'string | undefined': the values always are strings
  const enrichment: Enrichment = {
    id: rawEnrichment.value,
    additionalType: fromClassToAboutType(additionalType),
    // @ts-expect-error:TS2322
    about: isPartOf,
    // @ts-expect-error:TS2322
    description,
    // @ts-expect-error:TS2322
    citation,
    inLanguage,
    creator: {
      // @ts-expect-error:TS2322
      id: creator,
      // @ts-expect-error:TS2322
      name: creatorName,
    },
    // @ts-expect-error:TS2322
    license,
    dateCreated,
  };

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
