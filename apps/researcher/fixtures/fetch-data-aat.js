// CLI script for generating sample data, e.g.:
// node fetch-data-aat.js > terms.ttl

const QueryEngine = require('@comunica/query-sparql-file').QueryEngine;
const {SparqlEndpointFetcher} = require('fetch-sparql-endpoint');
const {EOL} = require('node:os');
const {stdout} = require('node:process');
const rdfSerializer = require('rdf-serialize').default;

const sparqlEndpointUrl = 'https://vocab.getty.edu/sparql';
const fetcher = new SparqlEndpointFetcher();
const myEngine = new QueryEngine();

async function getIrisFromFile(fileName) {
  const bindingsStream = await myEngine.queryBindings(
    `
    SELECT ?iri
    WHERE {
      ?s ?p ?iri .
      FILTER(STRSTARTS(STR(?iri), "http://vocab.getty.edu/aat/"))
    }`,
    {
      sources: [fileName],
    }
  );

  const bindings = await bindingsStream.toArray();
  const iris = bindings.map(binding => binding.get('iri').value);

  // Remove duplicate IRIs
  const uniqueIris = [...new Set(iris)];

  return uniqueIris;
}

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

(async () => {
  const irisInFiles = [
    await getIrisFromFile('objects-literals.ttl'),
    await getIrisFromFile('objects-provenance-literals.ttl'),
  ];

  const iris = irisInFiles.flat();
  await fetchData(iris);
})();
