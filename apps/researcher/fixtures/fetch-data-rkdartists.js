// CLI script for generating sample data, e.g.:
// node fetch-data-rkdartists.js > artists.ttl

const {SparqlEndpointFetcher} = require('fetch-sparql-endpoint');
const {EOL} = require('node:os');
const {stdout} = require('node:process');
const rdfSerializer = require('rdf-serialize').default;

const sparqlEndpointUrl =
  'https://api.data.netwerkdigitaalerfgoed.nl/datasets/rkd/rkdartists/services/rkdartists/sparql';
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
  'https://data.rkd.nl/artists/32439',
  'https://data.rkd.nl/artists/120388',
];

fetchData(iris);
