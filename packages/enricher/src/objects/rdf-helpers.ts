import {Agent} from '../definitions';
import {fromClassToType} from './helpers';
import {HeritageObjectEnrichment} from './definitions';
import {
  createDates,
  createThings,
  getPropertyValue,
  onlyOne,
} from '../rdf-helpers';
import {defu} from 'defu';
import type {Resource} from 'rdf-object';

export function toHeritageObjectEnrichment(rawEnrichment: Resource) {
  const additionalType = getPropertyValue(rawEnrichment, 'ex:additionalType');
  const about = getPropertyValue(rawEnrichment, 'ex:isPartOf')!;
  const creator = onlyOne(createThings<Agent>(rawEnrichment, 'ex:creator'))!;
  const license = getPropertyValue(rawEnrichment, 'ex:license')!;
  const dateCreated = onlyOne(createDates(rawEnrichment, 'ex:dateCreated'))!;
  const citation = getPropertyValue(rawEnrichment, 'ex:citation');
  const description = getPropertyValue(rawEnrichment, 'ex:description');
  const inLanguage = getPropertyValue(rawEnrichment, 'ex:inLanguage');

  const enrichment: HeritageObjectEnrichment = {
    id: rawEnrichment.value,
    type: fromClassToType(additionalType),
    about,
    citation,
    description,
    inLanguage,
    pubInfo: {
      creator,
      license,
      dateCreated,
    },
  };

  const enrichmentWithoutNullishValues = defu(enrichment, {});

  return enrichmentWithoutNullishValues;
}
