export const ontologyUrl = 'https://colonialcollections.nl/schema#'; // Internal ontology

export interface BasicEnrichment {
  id: string;
}

export interface Enrichment extends BasicEnrichment {
  description: string;
  citation: string;
  language?: string;
  creator: string;
  license: string;
  dateCreated: Date;
  about: {
    id: string;
    isPartOf: {
      id: string;
    };
  };
}
