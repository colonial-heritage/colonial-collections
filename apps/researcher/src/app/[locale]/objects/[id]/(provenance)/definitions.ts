import {ProvenanceEvent} from '@colonial-collections/api';
import {ProvenanceEventEnrichment} from '@colonial-collections/enricher';

export type LabeledProvenanceEvent = (
  | ProvenanceEvent
  | ProvenanceEventEnrichment
) & {label: string};

export type TimelineEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  selectIds: string[];
  labels: string[];
};
