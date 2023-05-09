// CLI script for generating sample data, e.g.:
// node fetch-data-aat.js > terms.ttl

const {SparqlEndpointFetcher} = require('fetch-sparql-endpoint');
const {EOL} = require('node:os');
const {stdout} = require('node:process');
const rdfSerializer = require('rdf-serialize').default;

const sparqlEndpointUrl = 'https://vocab.getty.edu/sparql';
const fetcher = new SparqlEndpointFetcher();

async function fetchDataByIri(iri) {
  const query = `CONSTRUCT WHERE { <${iri}> ?p ?o }`;
  const triplesStream = await fetcher.fetchTriples(sparqlEndpointUrl, query);
  const textStream = rdfSerializer.serialize(triplesStream, {
    contentType: 'text/turtle',
  });

  return textStream;
}

async function fetchData(iris) {
  const writeStream = stdout;

  writeStream.write(`###############################
# Sample data for testing
# Extracted from ${sparqlEndpointUrl}
###############################
`);

  for (const iri of iris) {
    const textStream = await fetchDataByIri(iri);
    textStream.pipe(writeStream).on('error', err => console.error(err));
    writeStream.write(EOL); // For readability
  }
}

const iris = [
  'http://vocab.getty.edu/aat/300033618',
  'http://vocab.getty.edu/aat/300015050',
  'http://vocab.getty.edu/aat/300014078',
  'http://vocab.getty.edu/aat/300404670',
  'http://vocab.getty.edu/aat/300388277',
  'http://vocab.getty.edu/aat/300435416',
  'http://vocab.getty.edu/aat/300152441',
  'http://vocab.getty.edu/aat/300055647',
  'http://vocab.getty.edu/aat/300379098',
  'http://vocab.getty.edu/aat/300055644',
  'http://vocab.getty.edu/aat/300033973',
  'http://vocab.getty.edu/aat/300014109',
  'http://vocab.getty.edu/aat/300015012',
  'http://vocab.getty.edu/aat/300006891',
  'http://vocab.getty.edu/aat/300005500',
  'http://vocab.getty.edu/aat/300028702',
  'http://vocab.getty.edu/aat/300046300',
  'http://vocab.getty.edu/aat/300133274',
  'http://vocab.getty.edu/aat/300005734',
  'http://vocab.getty.edu/aat/300404626',
  'http://vocab.getty.edu/aat/300215302',
];

fetchData(iris);
