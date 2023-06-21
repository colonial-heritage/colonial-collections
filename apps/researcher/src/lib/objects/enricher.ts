import {Agent, HeritageObject, Place, ProvenanceEvent, Term} from '.';
import {isIri} from '@colonial-collections/iris';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {merge} from '@hapi/hoek';
import type {Readable} from 'node:stream';
import {lru, LRU} from 'tiny-lru';
import type {Stream} from '@rdfjs/types';
import {RdfObjectLoader, Resource} from 'rdf-object';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type EnricherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

const loadByIrisOptionsSchema = z.object({
  iris: z.array(z.string()),
});

export type LoadByIrisOptions = z.infer<typeof loadByIrisOptionsSchema>;

const getByIriOptionsSchema = z.object({
  iri: z.string(),
});

export type GetByIriOptions = z.infer<typeof getByIriOptionsSchema>;

const cacheValueIfIriNotFound = Symbol('cacheValueIfIriNotFound');

// Can be expanded to also include other properties from 'HeritageObject'
export type PartialHeritageObject = Pick<HeritageObject, 'id' | 'subjectOf'>;

// Fetches data from a SPARQL endpoint for enriching heritage objects
export class HeritageObjectEnricher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private cache: LRU<PartialHeritageObject | typeof cacheValueIfIriNotFound> =
    lru(1000); // TBD: make the max configurable?

  constructor(options: EnricherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  private getFetchableIris(iris: string[]) {
    // Remove duplicate IRIs
    const uniqueIris = [...new Set(iris)];

    // Remove invalid IRIs and IRIs already cached
    const validAndUncachedIris = uniqueIris.filter(
      (iri: string) => isIri(iri) && this.cache.get(iri) === undefined
    );

    return validAndUncachedIris;
  }

  private async fetchByIris(iris: string[]) {
    if (iris.length === 0) {
      return; // No IRIs to fetch
    }

    const irisForValues = iris.map(iri => `<${iri}>`).join(' ');

    // Query can be expanded to also include other properties
    const query = `
      PREFIX cc: <https://colonialcollections.nl/search#>

      CONSTRUCT {
        ?iri cc:subjectOf ?provenanceEvent .
        ?provenanceEvent cc:additionalType ?additionalType ;
          cc:startDate ?startDate ;
          cc:endDate ?endDate ;
          cc:transferredFrom ?transferredFrom ;
          cc:transferredTo ?transferredTo ;
          cc:description ?description ;
          cc:location ?location ;
          cc:startsAfter ?startsAfter ;
          cc:endsBefore ?endsBefore .
        ?additionalType cc:name ?additionalTypeName .
        ?transferredFrom cc:name ?transferredFromName .
        ?transferredTo cc:name ?transferredToName .
        ?location cc:name ?locationName .
      }
      WHERE {
        VALUES ?iri { ${irisForValues} }
        ?iri a cc:HeritageObject ;
          cc:subjectOf ?provenanceEvent .
        ?provenanceEvent a cc:Event .
        OPTIONAL {
          ?provenanceEvent cc:additionalType ?additionalType .
          ?additionalType cc:name ?additionalTypeName .
        }
        OPTIONAL { ?provenanceEvent cc:startDate ?startDate }
        OPTIONAL { ?provenanceEvent cc:endDate ?endDate }
        OPTIONAL {
          ?provenanceEvent cc:transferredFrom ?transferredFrom .
          ?transferredFrom cc:name ?transferredFromName .
        }
        OPTIONAL {
          ?provenanceEvent cc:transferredTo ?transferredTo .
          ?transferredTo cc:name ?transferredToName .
        }
        OPTIONAL { ?provenanceEvent cc:description ?description }
        OPTIONAL {
          ?provenanceEvent cc:location ?location .
          ?location cc:name ?locationName .
        }
        OPTIONAL { ?provenanceEvent cc:startsAfter ?startsAfter }
        OPTIONAL { ?provenanceEvent cc:endsBefore ?endsBefore }
      }
    `;

    // The endpoint throws an error if an IRI is not valid
    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private processResource(rawHeritageObject: Resource) {
    const rawProvenanceEvents = rawHeritageObject.properties['cc:subjectOf'];
    const provenanceEvents = rawProvenanceEvents.map(rawProvenanceEvent => {
      const id = rawProvenanceEvent.value;
      const startDate = rawProvenanceEvent.property['cc:startDate'];
      const endDate = rawProvenanceEvent.property['cc:endDate'];
      const description = rawProvenanceEvent.property['cc:description'];
      const startsAfter = rawProvenanceEvent.property['cc:startsAfter'];
      const endsBefore = rawProvenanceEvent.property['cc:endsBefore'];

      const provenanceEventWithUndefinedValues: ProvenanceEvent = {
        id,
        types: [],
        description: description ? description.value : undefined,
        startDate: startDate ? new Date(startDate.value) : undefined,
        endDate: endDate ? new Date(endDate.value) : undefined,
        startsAfter: startsAfter ? startsAfter.value : undefined,
        endsBefore: endsBefore ? endsBefore.value : undefined,
      };

      provenanceEventWithUndefinedValues.types = [];
      const additionalTypes =
        rawProvenanceEvent.properties['cc:additionalType'];
      for (const additionalType of additionalTypes) {
        const additionalTypeName = additionalType.property['cc:name'];
        const term: Term = {
          id: additionalType.value,
          name: additionalTypeName ? additionalTypeName.value : undefined,
        };
        provenanceEventWithUndefinedValues.types.push(term);
      }

      const transferredFrom = rawProvenanceEvent.property['cc:transferredFrom'];
      if (transferredFrom !== undefined) {
        const transferredFromName = transferredFrom.property['cc:name'];
        const agent: Agent = {
          id: transferredFrom.value,
          name: transferredFromName ? transferredFromName.value : undefined,
        };
        provenanceEventWithUndefinedValues.transferredFrom = agent;
      }

      const transferredTo = rawProvenanceEvent.property['cc:transferredTo'];
      if (transferredTo !== undefined) {
        const transferredToName = transferredTo.property['cc:name'];
        const agent: Agent = {
          id: transferredTo.value,
          name: transferredToName ? transferredToName.value : undefined,
        };
        provenanceEventWithUndefinedValues.transferredTo = agent;
      }

      const location = rawProvenanceEvent.property['cc:location'];
      if (location !== undefined) {
        const locationName = location.property['cc:name'];
        const place: Place = {
          id: location.value,
          name: locationName ? locationName.value : undefined,
        };
        provenanceEventWithUndefinedValues.location = place;
      }

      const provenanceEvent = merge({}, provenanceEventWithUndefinedValues, {
        nullOverride: false,
      });

      return provenanceEvent;
    });

    // TODO: sort provenance events

    const partialHeritageObject: PartialHeritageObject = {
      id: rawHeritageObject.value,
      subjectOf: provenanceEvents,
    };

    return partialHeritageObject;
  }

  private async processResponse(iris: string[], stream: Readable & Stream) {
    const loader = new RdfObjectLoader({
      context: {
        cc: 'https://colonialcollections.nl/search#',
      },
    });

    await loader.import(stream);

    iris.forEach(iri => {
      const rawHeritageObject = loader.resources[iri];

      // Cache IRIs that don't belong to a resource; otherwise these
      // will be fetched again and again on subsequent requests
      if (rawHeritageObject === undefined) {
        this.cache.set(iri, cacheValueIfIriNotFound);
      } else {
        const partialHeritageObject = this.processResource(rawHeritageObject);
        this.cache.set(iri, partialHeritageObject);
      }
    });
  }

  async loadByIris(options: LoadByIrisOptions) {
    const opts = loadByIrisOptionsSchema.parse(options);

    const iris = this.getFetchableIris(opts.iris);

    // TBD: the endpoint could limit its results if we request
    // a large number of IRIs at once. Split the IRIs into chunks
    // of e.g. 1000 IRIs and call the endpoint per chunk?
    try {
      const stream = await this.fetchByIris(iris);
      if (stream !== undefined) {
        await this.processResponse(iris, stream);
      }
    } catch (err) {
      console.error(err); // TODO: add logger
    }
  }

  getByIri(options: GetByIriOptions) {
    const opts = getByIriOptionsSchema.parse(options);
    const partialHeritageObject = this.cache.get(opts.iri);
    return partialHeritageObject !== cacheValueIfIriNotFound
      ? partialHeritageObject
      : undefined;
  }
}
