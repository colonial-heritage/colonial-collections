import {Agent, Place, Term} from '../definitions';
import {ProvenanceEventEnrichment, ProvenanceEventType} from './definitions';
import {
  createDates,
  createThings,
  createTimeSpans,
  getPropertyValue,
  onlyOne,
} from '../rdf-helpers';
import {defu} from 'defu';
import type {Resource} from 'rdf-object';

export function toProvenanceEventEnrichment(rawEnrichment: Resource) {
  const id = rawEnrichment.value;
  const rawType = getPropertyValue(rawEnrichment, 'rdf:type');
  const type =
    rawType === 'https://example.org/Acquisition'
      ? ProvenanceEventType.Acquisition
      : ProvenanceEventType.TransferOfCustody;

  const about = getPropertyValue(rawEnrichment, 'ex:about')!;
  const creator = onlyOne(createThings<Agent>(rawEnrichment, 'ex:creator'))!;
  const license = getPropertyValue(rawEnrichment, 'ex:license')!;
  const dateCreated = onlyOne(createDates(rawEnrichment, 'ex:dateCreated'))!;
  const citation = getPropertyValue(rawEnrichment, 'ex:citation');
  const description = getPropertyValue(rawEnrichment, 'ex:description');
  const inLanguage = getPropertyValue(rawEnrichment, 'ex:inLanguage');
  const location = onlyOne(createThings<Place>(rawEnrichment, 'ex:location'));
  const transferredFrom = onlyOne(
    createThings<Agent>(rawEnrichment, 'ex:transferredFrom')
  );
  const transferredTo = onlyOne(
    createThings<Agent>(rawEnrichment, 'ex:transferredTo')
  );
  const date = onlyOne(createTimeSpans(rawEnrichment, 'ex:date'));
  const additionalTypes = createThings<Term>(
    rawEnrichment,
    'ex:additionalType'
  );

  const enrichment: ProvenanceEventEnrichment = {
    id,
    type,
    additionalTypes,
    about,
    citation,
    description,
    inLanguage,
    location,
    transferredFrom,
    transferredTo,
    date,
    pubInfo: {
      creator,
      license,
      dateCreated,
    },
  };

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
