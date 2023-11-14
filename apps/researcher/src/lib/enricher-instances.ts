import {
  EnrichmentFetcher,
  EnrichmentStorer,
  NanopubWriter,
} from '@colonial-collections/enricher';
import {env} from 'node:process';

export const fetcher = new EnrichmentFetcher({
  endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
});

const nanopubWriter = new NanopubWriter({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

export const storer = new EnrichmentStorer({nanopubWriter});
