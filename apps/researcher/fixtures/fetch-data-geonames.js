// CLI script for generating sample data, e.g.:
// node fetch-data-geonames.js > locations.ttl

const QueryEngine = require('@comunica/query-sparql-file').QueryEngine;
const {EOL} = require('node:os');
const {stdout} = require('node:process');
const rdfDereferencer = require('rdf-dereference').default;
const rdfSerializer = require('rdf-serialize').default;

const myEngine = new QueryEngine();

async function getIrisFromFile(fileName) {
  const bindingsStream = await myEngine.queryBindings(
    `
    SELECT ?iri
    WHERE {
      ?s ?p ?iri .
      FILTER(STRSTARTS(STR(?iri), "https://sws.geonames.org/"))
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
  const {data} = await rdfDereferencer.dereference(iri);
  const textStream = rdfSerializer.serialize(data, {
    contentType: 'text/turtle',
  });

  return textStream;
}

async function fetchData(iris) {
  const writeStream = stdout;

  writeStream.write(`###############################
# Sample data for testing
###############################
`);

  for (const iri of iris) {
    const textStream = await fetchDataByIri(iri);
    textStream.pipe(writeStream).on('error', err => console.error(err));
    writeStream.write(EOL); // For readability
  }
}

(async () => {
  const iris = await getIrisFromFile('persons.ttl');
  await fetchData(iris);
})();
