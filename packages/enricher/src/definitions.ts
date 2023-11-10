export const ontologyUrl = 'https://colonialcollections.nl/schema#'; // Internal ontology

export interface BasicEnrichment {
  id: string;
}

export interface Enrichment extends BasicEnrichment {
  about: string;
  description: string;
  source: string;
  creator: string;
  license: string;
  dateCreated: Date;
}
