export type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
};

export type Organization = Thing;
export type Term = Thing;
export type Person = Thing;
export type Dataset = Thing;

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
  creators?: Person[];
  images?: Image[];
  owner?: Organization;
  isPartOf: Dataset;
};
