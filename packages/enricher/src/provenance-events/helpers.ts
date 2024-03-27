import {ProvenanceEventEnrichment, ProvenanceEventType} from './definitions';
import {getPropertyValue} from '../helpers';
import {defu} from 'defu';
import edtf from 'edtf';
import type {Resource} from 'rdf-object';

export function getStartDateAsXsd(dateValue: string) {
  const edtfDate = edtf(dateValue);
  const date = new Date(edtfDate.min); // E.g. 1881 = 1881-01-01
  const xsdDate = date.toISOString().slice(0, 10); // From e.g. "1881-01-01T00:00:00.000Z" to "1881-01-01"

  return xsdDate;
}

export function getEndDateAsXsd(dateValue: string) {
  const edtfDate = edtf(dateValue);
  const date = new Date(edtfDate.max); // E.g. 1805 = 1805-12-31
  const xsdDate = date.toISOString().slice(0, 10); // From e.g. "1805-12-31T23:59:59.000Z" to "1805-12-31"

  return xsdDate;
}

export function createEnrichment(rawEnrichment: Resource) {
  const rawType = getPropertyValue(rawEnrichment, 'rdf:type');
  const type =
    rawType === 'https://example.org/Acquisition'
      ? ProvenanceEventType.Acquisition
      : ProvenanceEventType.TransferOfCustody;

  const about = getPropertyValue(rawEnrichment, 'ex:about');
  const citation = getPropertyValue(rawEnrichment, 'ex:citation');
  const inLanguage = getPropertyValue(rawEnrichment, 'ex:inLanguage');
  const creator = getPropertyValue(rawEnrichment, 'ex:creator');
  const license = getPropertyValue(rawEnrichment, 'ex:license')!;

  const creatorResource = rawEnrichment.property['ex:creator'];
  const creatorName = getPropertyValue(creatorResource, 'ex:name');

  const rawDateCreated = getPropertyValue(rawEnrichment, 'ex:dateCreated');
  const dateCreated = new Date(rawDateCreated!);

  const enrichment: ProvenanceEventEnrichment = {
    type,
    id: rawEnrichment.value,
    about: about!,
    citation: citation!,
    inLanguage,
    creator: {
      id: creator!,
      name: creatorName!,
    },
    license,
    dateCreated,
  };

  const additionalType = getPropertyValue(rawEnrichment, 'ex:additionalType');
  if (additionalType !== undefined) {
    const additionalTypeResource = rawEnrichment.property['ex:additionalType'];
    const additionalTypeName = getPropertyValue(
      additionalTypeResource,
      'ex:name'
    );

    enrichment.additionalType = {
      id: additionalType,
      name: additionalTypeName!,
    };
  }

  const description = getPropertyValue(rawEnrichment, 'ex:description');
  if (description !== undefined) {
    enrichment.description = description;
  }

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
