import DatasetList from './dataset-list';

describe('<DatasetList />', () => {
  context('List rendering', () => {
    it('Shows 1 dataset card if one dataset is returned in the search result', () => {
      cy.fixture('search-results/one-dataset.json').then(searchResult => {
        cy.intercept({method: 'GET', url: '/api/datasets*'}, searchResult);
        cy.mount(
          <DatasetList initialSearchResult={searchResult} locale="en" />
        );
        cy.getBySel('dataset-card').its('length').should('eq', 1);
      });
    });

    it('Shows 3 dataset cards if 3 datasets are returned in the search result', () => {
      cy.fixture('search-results/multiple-datasets.json').then(searchResult => {
        cy.intercept({method: 'GET', url: '/api/datasets*'}, searchResult);
        cy.mount(
          <DatasetList initialSearchResult={searchResult} locale="en" />
        );
        cy.getBySel('dataset-card').its('length').should('eq', 3);
      });
    });

    it('Shows 0 dataset cards if 0 datasets are returned in the search result', () => {
      cy.fixture('search-results/no-datasets.json').then(searchResult => {
        cy.intercept({method: 'GET', url: '/api/datasets*'}, searchResult);
        cy.mount(
          <DatasetList initialSearchResult={searchResult} locale="en" />
        );
        cy.getBySel('dataset-card').should('not.exist');
        cy.getBySel('no-results').should('exist');
      });
    });
  });
});
