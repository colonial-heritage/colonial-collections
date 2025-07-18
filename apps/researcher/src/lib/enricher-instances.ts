import {
  EnrichmentCreator,
  HeritageObjectEnrichmentFetcher,
  NanopubClient,
  ProvenanceEventEnrichmentFetcher,
  LocalContextsNoticesEnrichmentFetcher,
} from '@colonial-collections/enricher';
import {env} from 'node:process';

export const heritageObjectEnrichmentFetcher =
  new HeritageObjectEnrichmentFetcher({
    endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
  });

export const provenanceEventEnrichmentFetcher =
  new ProvenanceEventEnrichmentFetcher({
    endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
  });

export const localContextsNoticesEnrichmentFetcher =
  new LocalContextsNoticesEnrichmentFetcher({
    endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
  });

export const creator = new EnrichmentCreator({
  nanopubClient: new NanopubClient({
    endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
    privateKey: env.NANOPUB_PRIVATE_KEY as string,
  }),
});
