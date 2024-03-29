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

  const enrichment: ProvenanceEventEnrichment = {
    id,
    type,
    about,
    pubInfo: {
      creator,
      license,
      dateCreated,
    },
  };

  enrichment.additionalTypes = createThings<Term>(
    rawEnrichment,
    'ex:additionalType'
  );
  enrichment.citation = getPropertyValue(rawEnrichment, 'ex:citation');
  enrichment.description = getPropertyValue(rawEnrichment, 'ex:description');
  enrichment.inLanguage = getPropertyValue(rawEnrichment, 'ex:inLanguage');
  enrichment.date = onlyOne(createTimeSpans(rawEnrichment, 'ex:date'));
  enrichment.transferredFrom = onlyOne(
    createThings<Agent>(rawEnrichment, 'ex:transferredFrom')
  );
  enrichment.transferredTo = onlyOne(
    createThings<Agent>(rawEnrichment, 'ex:transferredTo')
  );
  enrichment.location = onlyOne(
    createThings<Place>(rawEnrichment, 'ex:location')
  );

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
