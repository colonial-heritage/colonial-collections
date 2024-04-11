import {ProvenanceEvent} from '@colonial-collections/api';

export type LabeledProvenanceEvent = ProvenanceEvent & {label: string};

export type TimelineEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  selectIds: string[];
  labels: string[];
};

export enum ProvenanceEventType {
  Acquisition = 'acquisition',
  TransferOfCustody = 'transferOfCustody',
}
