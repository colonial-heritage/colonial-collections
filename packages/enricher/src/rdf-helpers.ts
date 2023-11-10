import type {Enrichment} from './definitions';
import type {Resource} from 'rdf-object';

function getProperty(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  return property;
}

function getPropertyValue(resource: Resource, propertyName: string) {
  const property = getProperty(resource, propertyName);
  if (property === undefined) {
    return undefined;
  }

  return property.value;
}

export function createEnrichment(rawEnrichment: Resource) {
  const about = getPropertyValue(rawEnrichment, 'cc:about');
  const description = getPropertyValue(rawEnrichment, 'cc:description');
  const source = getPropertyValue(rawEnrichment, 'cc:source');
  const creator = getPropertyValue(rawEnrichment, 'cc:creator');
  const license = getPropertyValue(rawEnrichment, 'cc:license');

  const rawDateCreated = getPropertyValue(rawEnrichment, 'cc:dateCreated');
  // @ts-expect-error:TS2322
  const dateCreated = new Date(rawDateCreated);

  // Silence TS errors about 'string | undefined': the values always are strings
  const enrichment: Enrichment = {
    id: rawEnrichment.value,
    // @ts-expect-error:TS2322
    about,
    // @ts-expect-error:TS2322
    description,
    // @ts-expect-error:TS2322
    source,
    // @ts-expect-error:TS2322
    creator,
    // @ts-expect-error:TS2322
    license,
    dateCreated,
  };

  return enrichment;
}
