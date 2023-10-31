import {Enricher, NanopubWriter} from '@colonial-collections/enricher';
import {env} from 'node:process';

const nanopubWriter = new NanopubWriter({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const enricher = new Enricher({nanopubWriter});

export default enricher;
