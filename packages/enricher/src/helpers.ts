import {
  ontologyVersionIdentifier,
  ontologyUrl,
  AboutType,
  Enrichment,
} from './definitions';
import {defu} from 'defu';
import type {Resource} from 'rdf-object';

export function fromAboutTypeToClass(aboutType: AboutType) {
  let className;
  if (aboutType === AboutType.Description) {
    className = 'Description';
  } else if (aboutType === AboutType.Name) {
    className = 'Name';
  } else {
    throw new TypeError(`Unknown type: "${aboutType}"`);
  }

  return `${ontologyUrl}${className}${ontologyVersionIdentifier}`;
}

function fromClassToAboutType(className: string | undefined) {
  let aboutType: AboutType;
  if (className === `${ontologyUrl}Description${ontologyVersionIdentifier}`) {
    aboutType = AboutType.Description;
  } else if (className === `${ontologyUrl}Name${ontologyVersionIdentifier}`) {
    aboutType = AboutType.Name;
  } else {
    throw new TypeError(`Unknown class name: "${className}"`);
  }

  return aboutType;
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
  const about = getPropertyValue(rawEnrichment, 'cc:about');
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
    about: {
      // @ts-expect-error:TS2322
      id: about,
      isPartOf: {
        // @ts-expect-error:TS2322
        id: isPartOf,
      },
    },
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
