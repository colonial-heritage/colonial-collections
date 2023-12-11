export type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
};

export type Publisher = Thing;
export type License = Thing;
export type Place = Thing;
export type Term = Thing;

export type Metric = Thing & {
  order: number; // To aid clients in presenting information in UIs
};

export type Measurement = {
  id: string;
  value: boolean; // TBD: may need to support other types at some point
  metric: Metric;
};

export type Dataset = {
  id: string;
  name?: string;
  publisher?: Publisher;
  license?: License;
  description?: string;
  keywords?: string[];
  mainEntityOfPages?: string[];
  dateCreated?: Date;
  dateModified?: Date;
  datePublished?: Date;
  measurements?: Measurement[];
};
