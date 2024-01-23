import {ProvenanceEvent} from '@/lib/api/definitions';

export type LabeledProvenanceEvent = ProvenanceEvent & {label: string};

export type TimelineEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  selectIds: string[];
  labels: string[];
};
