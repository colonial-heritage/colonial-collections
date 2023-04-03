// CLI script for generating sample data, e.g.:
// node fetch-terms-aat.js > genres.ttl

const {SparqlEndpointFetcher} = require('fetch-sparql-endpoint');
const {EOL} = require('node:os');
const {stdout} = require('node:process');
const rdfSerializer = require('rdf-serialize').default;

const sparqlEndpointUrl = 'https://vocab.getty.edu/sparql';
const fetcher = new SparqlEndpointFetcher();

async function fetchDataByIri(iri) {
  const query = `DESCRIBE <${iri}>`;
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
  'http://vocab.getty.edu/aat/300386957',
  'http://vocab.getty.edu/aat/300417586',
  'http://vocab.getty.edu/aat/300043196',
  'http://vocab.getty.edu/aat/300404198',
  'http://vocab.getty.edu/aat/300431978',
  'http://vocab.getty.edu/aat/300048715',
  'http://vocab.getty.edu/aat/300027200',
  'http://vocab.getty.edu/aat/300111999',
];

fetchData(iris);
