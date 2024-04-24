import {ProvenanceEvent} from '@colonial-collections/api';
import {ProvenanceEventEnrichment} from '@colonial-collections/enricher';
import {getTranslations} from 'next-intl/server';
import YAML from 'yaml';
import {UserProvenanceEvent} from './definitions';
import {qualifierOptions, typeMapping} from '@/lib/provenance-options';
import useObject from '../use-object';

export async function getQualifierName(
  event: ProvenanceEvent | ProvenanceEventEnrichment
) {
  const t = await getTranslations('QualifierSelector');

  if (!('qualifier' in event) || !event.qualifier?.id) {
    return undefined;
  }

  const translationKey = qualifierOptions.find(
    qualifier => qualifier.id === event.qualifier!.id
  )?.translationKey;

  return translationKey ? t(translationKey) : event.qualifier.name;
}

export function getMotivations(
  event: ProvenanceEvent | ProvenanceEventEnrichment
) {
  const parsedDescription = event.description && YAML.parse(event.description);

  if (
    typeof parsedDescription === 'object' &&
    !Array.isArray(parsedDescription) &&
    parsedDescription !== null
  ) {
    return parsedDescription;
  }
  return undefined;
}

export async function getTypeName(
  event: ProvenanceEvent | ProvenanceEventEnrichment
) {
  const t = await getTranslations('ProvenanceEventType');

  return event.additionalTypes
    ?.map(type => {
      const translationKey = Object.values(typeMapping).find(
        mapping =>
          mapping.type === event.type && mapping.additionalType === type.id
      )?.translationKey;

      const name = translationKey ? t(translationKey) : type.name;
      return name;
    })
    .join(', ');
}

export async function transformEvents(
  events: (ProvenanceEvent | ProvenanceEventEnrichment)[]
): Promise<UserProvenanceEvent[]> {
  const t = await getTranslations('Provenance');
  const {organization} = useObject.getState();

  return Promise.all(
    events.map(async (event, index) => {
      const isEnrichment = 'pubInfo' in event;
      return {
        id: event.id,
        qualifierName: await getQualifierName(event),
        typeName: await getTypeName(event),
        motivations: getMotivations(event),
        transferredToName: event.transferredTo?.name,
        transferredFromName: event.transferredFrom?.name,
        locationName: event.location?.name,
        date: event.date,
        label: `${t('initial')}${index + 1}`,
        dateCreated: isEnrichment ? event.pubInfo.dateCreated : undefined,
        citation: isEnrichment ? event.citation : undefined,
        creatorName: isEnrichment
          ? event.pubInfo.creator.name
          : organization?.name,
        communityName: isEnrichment
          ? event.pubInfo.creator.isPartOf?.name
          : undefined,
        isCurrentPublisher: !isEnrichment,
      };
    })
  );
}
