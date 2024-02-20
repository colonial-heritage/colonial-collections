import {z} from 'zod';

export const localeSchema = z.enum(['en', 'nl']).optional().default('en');

export const ontologyUrl = 'https://colonialcollections.nl/schema#'; // Internal ontology

export type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
};

export type Term = Thing;
export type Place = Thing & {isPartOf?: Place};
export type Unknown = Thing & {type: 'Unknown'};
export type Agent = Person | Organization | Unknown;
export type License = Thing;

export type Dataset = Thing & {
  publisher?: Agent;
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

export type HeritageObject = {
  id: string;
  identifier?: string;
  name?: string;
  description?: string;
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
};

export type ProvenanceEvent = {
  id: string;
  types?: Term[];
  date?: TimeSpan;
  startDate?: Date; // For BC; remove when prop date is in use
  endDate?: Date; // For BC; remove when prop date is in use
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
