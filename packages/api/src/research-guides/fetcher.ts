import {isIri} from '@colonial-collections/iris';
import type {Stream} from '@rdfjs/types';
import {IBindings, SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {EOL} from 'node:os';
import type {Readable} from 'node:stream';
import {RdfObjectLoader} from 'rdf-object';
import {z} from 'zod';
import {localeSchema} from '../definitions';
import {ResearchGuide} from './definitions';
import {createResearchGuide} from './rdf-helpers';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const getTopLevelsOptionsSchema = z.object({
  locale: localeSchema,
});

export type GetTopLevelsOptions = z.input<typeof getTopLevelsOptionsSchema>;

const getByTopLevelOptionsSchema = z.object({
  locale: localeSchema,
});

export type GetByTopLevelOptions = z.input<typeof getByTopLevelOptionsSchema>;

const getByIdsOptionsSchema = z.object({
  locale: localeSchema,
  ids: z.array(z.string()),
});

export type GetByIdsOptions = z.input<typeof getByIdsOptionsSchema>;

const getByIdOptionsSchema = z.object({
  locale: localeSchema,
  id: z.string(),
});

export type GetByIdOptions = z.input<typeof getByIdOptionsSchema>;

export class ResearchGuideFetcher {
  private readonly endpointUrl: string;
  private readonly fetcher = new SparqlEndpointFetcher();

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchTopLevelTriples(options: GetByIdsOptions) {
    const iris = options.ids.map(iri => `<${iri}>`).join(EOL);

    const query = `
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX ex: <https://example.org/>
      PREFIX la: <https://linked.art/ns/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <https://schema.org/>

      CONSTRUCT {
        ?topSet a ex:CreativeWork ;
          ex:name ?topSetName ;
          ex:abstract ?topSetAbstract ;
          ex:text ?topSetText ;
          ex:encodingFormat ?topSetEncodingFormat ;
          ex:seeAlso ?subSet .

        ?subSet a ex:CreativeWork ;
          ex:identifier ?identifier ;
          ex:seeAlso ?guide .

        ?guide a ex:CreativeWork ;
          ex:name ?guideName ;
          ex:seeAlso ?relatedGuide .

        ?relatedGuide a ex:CreativeWork ;
          ex:name ?subGuideName .
      }
      WHERE {
        VALUES ?topSet {
          ${iris}
        }

        OPTIONAL {
          ?topSet schema:name ?topSetName ;
          FILTER(LANG(?topSetName) = "${options.locale}")
        }

        OPTIONAL {
          ?topSet schema:abstract ?topSetAbstract
          FILTER(LANG(?topSetAbstract) = "${options.locale}")
        }

        OPTIONAL {
          ?topSet schema:name ?topSetText ;
          FILTER(LANG(?topSetText) = "${options.locale}")
        }

        OPTIONAL {
          ?topSet schema:encodingFormat ?topSetEncodingFormat
        }

        OPTIONAL {
          ?topSet la:has_member ?subSet .

          OPTIONAL {
            ?subSet crm:P1_is_identified_by/crm:P190_has_symbolic_content ?identifier
          }

          # Get a selection of information from member guides, if any
          OPTIONAL {
            ?subSet la:has_member ?guide .
            ?guide schema:name ?guideName
            FILTER(LANG(?guideName) = "${options.locale}")

            # Get a selection of information from related guides, if any
            OPTIONAL {
              ?guide rdfs:seeAlso ?relatedGuide .
              ?relatedGuide schema:name ?relatedGuideName
              FILTER(LANG(?relatedGuideName) = "${options.locale}")
            }
          }
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async getTopLevelIds() {
    const query = `
      PREFIX la: <https://linked.art/ns/terms/>

      SELECT ?this
      WHERE {
        ?this a la:Set .
        FILTER NOT EXISTS {
          ?this la:member_of []
        }
      }
    `;

    const bindingsStream = await this.fetcher.fetchBindings(
      this.endpointUrl,
      query
    );

    const topLevelIds: string[] = [];

    for await (const rawBindings of bindingsStream) {
      const bindings = rawBindings as unknown as IBindings; // TS assumes it's a string or Buffer
      const topLevelId = bindings.this.value;
      topLevelIds.push(topLevelId);
    }

    return topLevelIds;
  }

  private async fetchResearchGuideTriples(options: GetByIdsOptions) {
    const iris = options.ids.map(iri => `<${iri}>`).join(EOL);

    const query = `
      PREFIX ex: <https://example.org/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX schema: <https://schema.org/>

      CONSTRUCT {
        ?this a ex:CreativeWork ;
          ex:name ?name ;
          ex:abstract ?abstract ;
          ex:text ?text ;
          ex:encodingFormat ?encodingFormat ;
          ex:seeAlso ?relatedGuide ;
          ex:contentLocation ?contentLocation ;
          ex:keyword ?keyword ;
          ex:citation ?citation .

        ?relatedGuide a ex:CreativeWork ;
          ex:name ?relatedGuideName .

        ?contentLocation a ex:Place ;
          ex:name ?contentLocationName ;
          ex:sameAs ?contentLocationSameAs .

        ?keyword a ex:DefinedTerm ;
          ex:name ?keywordName ;
          ex:sameAs ?keywordSameAs .

        ?citation a ex:CreativeWork ;
          ex:name ?citationName ;
          ex:description ?citationDescription ;
          ex:url ?citationUrl .
      }
      WHERE {
        VALUES ?this {
          ${iris}
        }

        ?this a schema:TextDigitalDocument ;
          schema:additionalType <http://vocab.getty.edu/aat/300027029> . # "Guides"

        OPTIONAL {
          ?this schema:name ?name .
          FILTER(LANG(?name) = "${options.locale}")
        }

        OPTIONAL {
          ?this schema:abstract ?abstract .
          FILTER(LANG(?abstract) = "${options.locale}")
        }

        OPTIONAL {
          ?this schema:text ?text .
          FILTER(LANG(?text) = "${options.locale}")
        }

        OPTIONAL {
          ?this schema:encodingFormat ?encodingFormat .
        }

        # Get a selection of information from related guides, if any
        OPTIONAL {
          ?this rdfs:seeAlso ?relatedGuide .
          ?relatedGuide schema:name ?relatedGuideName .
          FILTER(LANG(?relatedGuideName) = "${options.locale}")
        }

        OPTIONAL {
          ?this schema:contentLocation ?contentLocation .

          OPTIONAL {
            ?contentLocation schema:name ?contentLocationName .
            FILTER(LANG(?contentLocationName) = "${options.locale}")
          }

          OPTIONAL {
            ?contentLocation schema:sameAs ?contentLocationSameAs
          }
        }

        OPTIONAL {
          ?this schema:keywords ?keyword .

          OPTIONAL {
            ?keyword schema:name ?keywordName .
            FILTER(LANG(?keywordName) = "${options.locale}")
          }

          OPTIONAL {
            ?keyword schema:sameAs ?keywordSameAs
          }
        }

        OPTIONAL {
          ?this schema:citation ?citation .

          OPTIONAL {
            ?citation schema:name ?citationName .
            FILTER(LANG(?citationName) = "${options.locale}")
          }

          OPTIONAL {
            ?citation schema:description ?citationDescription .
            FILTER(LANG(?citationDescription) = "${options.locale}")
          }

          OPTIONAL {
            ?citation schema:url ?citationUrl .
          }
        }
      }
    `;

    return this.fetcher.fetchTriples(this.endpointUrl, query);
  }

  private async fromTriplesToResearchGuides(
    iris: string[],
    triplesStream: Readable & Stream
  ) {
    const loader = new RdfObjectLoader({
      context: {
        ex: 'https://example.org/',
      },
    });

    await loader.import(triplesStream);

    const researchGuides = iris.reduce(
      (researchGuides: ResearchGuide[], iri) => {
        const rawResearchGuide = loader.resources[iri];
        if (rawResearchGuide !== undefined) {
          const researchGuide = createResearchGuide(rawResearchGuide);
          researchGuides.push(researchGuide);
        }
        return researchGuides;
      },
      []
    );

    return researchGuides;
  }

  async getByIds(options: GetByIdsOptions) {
    const opts = getByIdsOptionsSchema.parse(options);

    if (opts.ids.length === 0) {
      return [];
    }

    const triplesStream = await this.fetchResearchGuideTriples(opts);
    const researchGuides = await this.fromTriplesToResearchGuides(
      opts.ids,
      triplesStream
    );

    return researchGuides;
  }

  async getById(options: GetByIdOptions) {
    const opts = getByIdOptionsSchema.parse(options);

    if (!isIri(opts.id)) {
      return undefined;
    }

    const researchGuides = await this.getByIds({
      locale: opts.locale,
      ids: [opts.id],
    });

    if (researchGuides.length !== 1) {
      return undefined;
    }

    return researchGuides[0];
  }

  async getTopLevels(options?: GetTopLevelsOptions) {
    const opts = getTopLevelsOptionsSchema.parse(options || {});

    const topLevelIds = await this.getTopLevelIds();

    if (topLevelIds.length === 0) {
      return [];
    }

    const triplesStream = await this.fetchTopLevelTriples({
      ids: topLevelIds,
      ...opts,
    });
    const researchGuides = await this.fromTriplesToResearchGuides(
      topLevelIds,
      triplesStream
    );

    return researchGuides;
  }
}
