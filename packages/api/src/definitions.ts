import {z} from 'zod';

export const localeSchema = z.enum(['en', 'nl']).optional().default('en');

export type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
  description?: string;
  sameAs?: string; // An identifier
};

export type Term = Thing;
export type Place = Thing & {isPartOf?: Place};
export type Unknown = Thing & {type: 'Unknown'};
export type Agent = Person | Organization | Unknown;
export type License = Thing;

export type Metric = Thing & {
  order: number; // To aid clients in presenting information in UIs
};

export type Measurement = {
  id: string;
  value: boolean; // TBD: may need to support other types at some point
  metric: Metric;
};

export type Dataset = Thing & {
  publisher?: Agent;
  license?: License;
  keywords?: string[];
  mainEntityOfPages?: string[];
  dateCreated?: Date;
  dateModified?: Date;
  datePublished?: Date;
  measurements?: Measurement[];
};

export type PostalAddress = {
  id: string;
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: string;
};

export type Organization = Thing & {
  type: 'Organization';
  url?: string;
  address?: PostalAddress;
};

export type Image = {
  id: string;
  contentUrl: string;
  license?: License;
};

export type TimeSpan = {
  id: string;
  startDate?: Date;
  endDate?: Date;
};

export type HeritageObject = Thing & {
  identifier?: string;
  inscriptions?: string[];
  types?: Term[];
  subjects?: Term[];
  materials?: Term[];
  techniques?: Term[];
  creators?: Agent[];
  locationsCreated?: Place[];
  dateCreated?: TimeSpan;
  images?: Image[];
  isPartOf?: Dataset;
  mainEntityOfPage?: string; // URL of web page
};

export type Event = {
  id: string;
  date?: TimeSpan;
};

export enum ProvenanceEventType {
  Acquisition = 'acquisition',
  TransferOfCustody = 'transferOfCustody',
}

export type ProvenanceEvent = {
  id: string;
  type: ProvenanceEventType;
  additionalTypes?: Term[];
  date?: TimeSpan;
  transferredFrom?: Agent;
  transferredTo?: Agent;
  description?: string;
  location?: Place;
  startsAfter?: string; // ID of another provenance event
  endsBefore?: string; // ID of another provenance event
};

export type Person = Thing & {
  type: 'Person';
  birthDate?: TimeSpan;
  birthPlace?: Place;
  deathDate?: TimeSpan;
  deathPlace?: Place;
  isPartOf?: Dataset;
};

export enum SortBy {
  BirthYear = 'birthYear',
  DateCreated = 'dateCreated',
  Name = 'name',
}

export const SortByEnum = z.nativeEnum(SortBy);

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export const SortOrderEnum = z.nativeEnum(SortOrder);

export type SearchResultFilter = {
  id: string | number;
  name?: string | number; // Name may not exist (e.g. in a specific locale)
  totalCount: number;
};
