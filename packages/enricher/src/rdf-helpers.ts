import type {Enrichment} from './definitions';
import type {Resource} from 'rdf-object';

function getPropertyValue(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  return property.value;
}

export function createEnrichment(rawEnrichment: Resource) {
  const about = getPropertyValue(rawEnrichment, 'cc:about');
  const isPartOf = getPropertyValue(rawEnrichment, 'cc:isPartOf');
  const description = getPropertyValue(rawEnrichment, 'cc:description');
  const citation = getPropertyValue(rawEnrichment, 'cc:citation');
  const inLanguage = getPropertyValue(rawEnrichment, 'cc:inLanguage');
  const creator = getPropertyValue(rawEnrichment, 'cc:creator');
  const license = getPropertyValue(rawEnrichment, 'cc:license');

  const rawDateCreated = getPropertyValue(rawEnrichment, 'cc:dateCreated');
  // @ts-expect-error:TS2322
  const dateCreated = new Date(rawDateCreated);

  // Silence TS errors about 'string | undefined': the values always are strings
  const enrichment: Enrichment = {
    id: rawEnrichment.value,
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
    // @ts-expect-error:TS2322
    creator,
    // @ts-expect-error:TS2322
    license,
    dateCreated,
  };

  // TODO: remove undefined values, e.g. inLanguage

  return enrichment;
}
