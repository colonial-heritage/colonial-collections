import {z} from 'zod';

export const ontologyUrl = 'https://colonialcollections.nl/schema#'; // Internal ontology

export type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
};

export type Term = Thing;
export type Place = Thing;
export type Dataset = Thing;
export type Person = Thing & {type: 'Person'};
export type Organization = Thing & {type: 'Organization'};
export type Unknown = Thing & {type: 'Unknown'};
export type Agent = Person | Organization | Unknown;

export type Image = {
  id: string;
  contentUrl: string;
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
  images?: Image[];
  owner?: Agent;
  isPartOf: Dataset;
};

export enum SortBy {
  Name = 'name',
  Relevance = 'relevance',
}

export const SortByEnum = z.nativeEnum(SortBy);

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export const SortOrderEnum = z.nativeEnum(SortOrder);

export type SearchResultFilter = Thing & {totalCount: number};

export type SearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  heritageObjects: HeritageObject[];
  filters: {
    owners: SearchResultFilter[];
    types: SearchResultFilter[];
    subjects: SearchResultFilter[];
  };
};

export type ProvenanceEvent = {
  id: string;
  types?: Term[];
  startDate?: Date;
  endDate?: Date;
  transferredFrom?: Agent;
  transferredTo?: Agent;
  description?: string;
  location?: Place;
  startsAfter?: string; // ID of another provenance event
  endsBefore?: string; // ID of another provenance event
};
