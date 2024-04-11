import {
  EnrichmentCreator,
  HeritageObjectEnrichmentFetcher,
  NanopubClient,
  ProvenanceEventEnrichmentFetcher,
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

export const creator = new EnrichmentCreator({
  knowledgeGraphEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
  nanopubClient: new NanopubClient({
    endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
    proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
  }),
});
