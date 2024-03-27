import {nanopubId, NanopubClient} from '../client';
import {
  ontologyUrl,
  ontologyVersionIdentifier,
  type BasicEnrichment,
} from '../definitions';
import {getEndDateAsXsd, getStartDateAsXsd} from './helpers';
import {
  fullProvenanceEventEnrichmentBeingCreatedSchema,
  FullProvenanceEventEnrichmentBeingCreated,
  ProvenanceEventType,
} from './definitions';
import {DataFactory} from 'rdf-data-factory';
import {RdfStore} from 'rdf-stores';
import {z} from 'zod';

const DF = new DataFactory();

const constructorOptionsSchema = z.object({
  nanopubClient: z.instanceof(NanopubClient),
});

export type ProvenanceEventEnrichmentStorerConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

// Low-level class for creating provenance event enrichments
// You should use the high-level EnrichmentCreator in most cases
export class ProvenanceEventEnrichmentStorer {
  private readonly nanopubClient: NanopubClient;

  constructor(options: ProvenanceEventEnrichmentStorerConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.nanopubClient = opts.nanopubClient;
  }

  async add(
    fullEnrichmentBeingCreated: FullProvenanceEventEnrichmentBeingCreated
  ) {
    const opts = fullProvenanceEventEnrichmentBeingCreatedSchema.parse(
      fullEnrichmentBeingCreated
    );

    const publicationStore = RdfStore.createDefault();
    const assertionStore = RdfStore.createDefault();
    const enrichmentId = DF.blankNode();
    const languageCode = opts.inLanguage;
    const isAcquisition = opts.type === ProvenanceEventType.Acquisition;

    // Make clear what application has published this nanopub
    const softwareTool = DF.namedNode('https://app.colonialcollections.nl/');

    publicationStore.addQuad(
      DF.quad(
        softwareTool,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode('http://purl.org/nanopub/x/SoftwareTool')
      )
    );

    publicationStore.addQuad(
      DF.quad(
        softwareTool,
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal('Colonial Collections')
      )
    );

    // Generic type of the nanopub: a nanopub
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode(`${ontologyUrl}Nanopub`)
      )
    );

    // Specific type of the nanopub: a provenance event
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode(
          `${ontologyUrl}ProvenanceEvent${ontologyVersionIdentifier}`
        )
      )
    );

    // Licence of the nanopub
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/dc/terms/license'),
        DF.namedNode(opts.license)
      )
    );

    // Tool that created the nanopub
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/nanopub/x/wasCreatedWith'),
        softwareTool
      )
    );

    // Connect the publication info to the enrichment
    publicationStore.addQuad(
      DF.quad(
        nanopubId,
        DF.namedNode('http://purl.org/nanopub/x/introduces'),
        enrichmentId
      )
    );

    // The server automatically adds 'dcterms:creator'.
    // A creator can change his or her name later on, but the name at the time of
    // creation is preserved.
    publicationStore.addQuad(
      DF.quad(
        DF.namedNode(opts.creator.id),
        DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        DF.literal(opts.creator.name)
      )
    );

    // Type of the provenance event
    const type = isAcquisition ? 'E8_Acquisition' : 'E10_Transfer_of_Custody';

    assertionStore.addQuad(
      DF.quad(
        enrichmentId,
        DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        DF.namedNode(`http://www.cidoc-crm.org/cidoc-crm/${type}`)
      )
    );

    // Classification of the provenance event (e.g. a gift or a purchase)
    if (opts.additionalType !== undefined) {
      const additionalTypeNode = DF.namedNode(opts.additionalType.id);

      // An IRI from a thesaurus, e.g. AAT
      assertionStore.addQuad(
        DF.quad(
          enrichmentId,
          DF.namedNode('http://www.cidoc-crm.org/cidoc-crm/P2_has_type'),
          additionalTypeNode
        )
      );

      // The name of the type
      assertionStore.addQuad(
        DF.quad(
          additionalTypeNode,
          DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
          DF.literal(opts.additionalType.name)
        )
      );
    }

    // The object that was transferred in the provenance event
    const objectPredicate = isAcquisition
      ? 'P24_transferred_title_of'
      : 'P30_transferred_custody_of';

    assertionStore.addQuad(
      DF.quad(
        enrichmentId,
        DF.namedNode(`http://www.cidoc-crm.org/cidoc-crm/${objectPredicate}`),
        DF.namedNode(opts.about.id)
      )
    );

    // Constituent who owned or kept the object
    if (opts.transferredFrom !== undefined) {
      const transferredFromNode = DF.namedNode(opts.transferredFrom.id);

      const transferredFromPredicate = isAcquisition
        ? 'P23_transferred_title_from'
        : 'P28_custody_surrendered_by';

      // An IRI from a constituent source, e.g. Wikidata
      assertionStore.addQuad(
        DF.quad(
          enrichmentId,
          DF.namedNode(
            `http://www.cidoc-crm.org/cidoc-crm/${transferredFromPredicate}`
          ),
          transferredFromNode
        )
      );

      // The name of the constituent
      assertionStore.addQuad(
        DF.quad(
          transferredFromNode,
          DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
          DF.literal(opts.transferredFrom.name)
        )
      );
    }

    // Constituent who received the object
    if (opts.transferredTo !== undefined) {
      const transferredToNode = DF.namedNode(opts.transferredTo.id);

      const transferredToPredicate = isAcquisition
        ? 'P22_transferred_title_to'
        : 'P29_custody_received_by';

      // An IRI from a constituent source, e.g. Wikidata
      assertionStore.addQuad(
        DF.quad(
          enrichmentId,
          DF.namedNode(
            `http://www.cidoc-crm.org/cidoc-crm/${transferredToPredicate}`
          ),
          transferredToNode
        )
      );

      // The name of the constituent
      assertionStore.addQuad(
        DF.quad(
          transferredToNode,
          DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
          DF.literal(opts.transferredTo.name)
        )
      );
    }

    // Location of the provenance event
    if (opts.location !== undefined) {
      const locationNode = DF.namedNode(opts.location.id);

      // An IRI from a location source, e.g. GeoNames
      assertionStore.addQuad(
        DF.quad(
          enrichmentId,
          DF.namedNode('http://www.cidoc-crm.org/cidoc-crm/P7_took_place_at'),
          locationNode
        )
      );

      // The name of the location
      assertionStore.addQuad(
        DF.quad(
          locationNode,
          DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
          DF.literal(opts.location.name)
        )
      );
    }

    // Date of the provenance event
    if (opts.date !== undefined) {
      const timeSpanId = DF.blankNode();
      const dateNode = DF.namedNode('http://www.w3.org/2001/XMLSchema#date');

      assertionStore.addQuad(
        DF.quad(
          timeSpanId,
          DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          DF.namedNode('http://www.cidoc-crm.org/cidoc-crm/E52_Time-Span')
        )
      );

      const startDate = getStartDateAsXsd(opts.date.startDate);

      assertionStore.addQuad(
        DF.quad(
          timeSpanId,
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/P82a_begin_of_the_begin'
          ),
          DF.literal(startDate, dateNode)
        )
      );

      const endDate = getEndDateAsXsd(opts.date.endDate);

      assertionStore.addQuad(
        DF.quad(
          timeSpanId,
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/P82b_end_of_the_end'
          ),
          DF.literal(endDate, dateNode)
        )
      );

      assertionStore.addQuad(
        DF.quad(
          enrichmentId,
          DF.namedNode('http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span'),
          timeSpanId
        )
      );
    }

    // Description of the provenance event
    if (opts.description !== undefined) {
      const descriptionId = DF.blankNode();

      assertionStore.addQuad(
        DF.quad(
          descriptionId,
          DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object'
          )
        )
      );

      assertionStore.addQuad(
        DF.quad(
          descriptionId,
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content'
          ),
          DF.literal(opts.description, languageCode)
        )
      );

      assertionStore.addQuad(
        DF.quad(
          descriptionId,
          DF.namedNode('http://www.cidoc-crm.org/cidoc-crm/P2_has_type'),
          DF.namedNode('http://vocab.getty.edu/aat/300444174') // "Provenance statement"
        )
      );

      assertionStore.addQuad(
        DF.quad(
          enrichmentId,
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by'
          ),
          descriptionId
        )
      );
    }

    // Citation of the provenance event
    if (opts.citation !== undefined) {
      const citationId = DF.blankNode();

      assertionStore.addQuad(
        DF.quad(
          citationId,
          DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object'
          )
        )
      );

      assertionStore.addQuad(
        DF.quad(
          citationId,
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content'
          ),
          DF.literal(opts.citation, languageCode)
        )
      );

      assertionStore.addQuad(
        DF.quad(
          citationId,
          DF.namedNode('http://www.cidoc-crm.org/cidoc-crm/P2_has_type'),
          DF.namedNode('http://vocab.getty.edu/aat/300435423') // "citations"
        )
      );

      assertionStore.addQuad(
        DF.quad(
          enrichmentId,
          DF.namedNode(
            'http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by'
          ),
          citationId
        )
      );
    }

    // TBD: store the level of certainty or uncertainty?

    const nanopub = await this.nanopubClient.add({
      assertionStore,
      publicationStore,
      creator: opts.creator.id,
    });

    const basicEnrichment: BasicEnrichment = {
      id: nanopub.id,
    };

    return basicEnrichment;
  }
}
