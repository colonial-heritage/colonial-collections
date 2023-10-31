import {Enricher, NanopubClient} from '@colonial-collections/enricher';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_PROXY_ENDPOINT_URL as string,
});

const enricher = new Enricher({nanopubClient});

export default enricher;
