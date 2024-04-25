import {TimeSpan} from '@colonial-collections/api';

export type UserProvenanceEvent = {
  id: string;
  label: string;
  motivations: Record<string, string>;
  typeName?: string;
  qualifierName?: string;
  transferredToName?: string;
  transferredFromName?: string;
  locationName?: string;
  date?: TimeSpan;
  dateCreated?: Date;
  citation?: string;
  creatorName?: string;
  communityName?: string;
  isCurrentPublisher: boolean;
  inLanguage?: string;
};

export type TimelineEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  selectIds: string[];
  labels: string[];
};
