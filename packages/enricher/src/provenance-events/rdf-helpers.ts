import {Term} from '../definitions';
import {
  ProvenanceEventEnrichment,
  ProvenanceEventType,
  TimeSpan,
} from './definitions';
import {
  createAgents,
  createDates,
  getPropertyValue,
  onlyOne,
} from '../rdf-helpers';
import {defu} from 'defu';
import edtf from 'edtf';
import type {Resource} from 'rdf-object';

function createThingFromProperty<T>(thingResource: Resource) {
  const name = getPropertyValue(thingResource, 'ex:name');

  const thing = {
    id: thingResource.value,
    name,
  };

  return thing as T;
}

function createThings<T>(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const things = properties.map(property =>
    createThingFromProperty<T>(property)
  );

  return things.length > 0 ? things : undefined;
}

function fromStringToEdtf(dateValue: string | undefined) {
  if (dateValue !== undefined) {
    try {
      return edtf(dateValue);
    } catch (err) {
      // Ignore invalid dates
    }
  }

  return undefined;
}

function createTimeSpan(timeSpanResource: Resource) {
  const rawStartDate = getPropertyValue(timeSpanResource, 'ex:startDate');
  const startDate = fromStringToEdtf(rawStartDate);

  const rawEndDate = getPropertyValue(timeSpanResource, 'ex:endDate');
  const endDate = fromStringToEdtf(rawEndDate);

  const timeSpan: TimeSpan = {
    id: timeSpanResource.value,
    startDate: startDate !== undefined ? new Date(startDate.min) : undefined, // E.g. 1881 = 1881-01-01
    endDate: endDate !== undefined ? new Date(endDate.max) : undefined, // E.g. 1805 = 1805-12-31
  };

  return timeSpan;
}

function createTimeSpans(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const timeSpans = properties.map(property => createTimeSpan(property));

  return timeSpans.length > 0 ? timeSpans : undefined;
}

export function toProvenanceEventEnrichment(rawEnrichment: Resource) {
  const rawType = getPropertyValue(rawEnrichment, 'rdf:type');
  const type =
    rawType === 'https://example.org/Acquisition'
      ? ProvenanceEventType.Acquisition
      : ProvenanceEventType.TransferOfCustody;

  const about = getPropertyValue(rawEnrichment, 'ex:about')!;
  const creator = onlyOne(createAgents(rawEnrichment, 'ex:creator'))!;
  const license = getPropertyValue(rawEnrichment, 'ex:license')!;
  const dateCreated = onlyOne(createDates(rawEnrichment, 'ex:dateCreated'))!;

  const enrichment: ProvenanceEventEnrichment = {
    id: rawEnrichment.value,
    type,
    about,
    pubInfo: {
      creator,
      license,
      dateCreated,
    },
  };

  const additionalTypes = createThings<Term>(
    rawEnrichment,
    'ex:additionalType'
  );
  if (additionalTypes !== undefined) {
    enrichment.additionalTypes = additionalTypes;
  }

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

  const date = onlyOne(createTimeSpans(rawEnrichment, 'ex:date'));
  if (date !== undefined) {
    enrichment.date = date;
  }

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
