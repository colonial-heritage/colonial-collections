import DatasetList, {Props} from './dataset-list';
import {NextIntlClientProvider} from 'next-intl';
import messages from '@/messages/en.json';

function DatasetListWithTranslation(props: Props) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <DatasetList {...props} />
    </NextIntlClientProvider>
  );
}

describe('List rendering', () => {
  it('shows 1 dataset card if one dataset is returned in the search result', () => {
    cy.fixture('search-results/one-dataset.json').then(searchResult => {
      cy.intercept({method: 'GET', url: '/api/datasets*'}, searchResult);
      cy.mount(
        <DatasetListWithTranslation
          initialSearchResult={searchResult}
          locale="en"
        />
      );
      cy.getBySel('dataset-card').its('length').should('eq', 1);
    });
  });

  it('shows 3 dataset cards if 3 datasets are returned in the search result', () => {
    cy.fixture('search-results/three-datasets.json').then(searchResult => {
      cy.intercept({method: 'GET', url: '/api/datasets*'}, searchResult);
      cy.mount(
        <DatasetListWithTranslation
          initialSearchResult={searchResult}
          locale="en"
        />
      );
      cy.getBySel('dataset-card').its('length').should('eq', 3);
    });
  });

  it('shows 0 dataset cards if 0 datasets are returned in the search result', () => {
    cy.fixture('search-results/no-datasets.json').then(searchResult => {
      cy.intercept({method: 'GET', url: '/api/datasets*'}, searchResult);
      cy.mount(
        <DatasetListWithTranslation
          initialSearchResult={searchResult}
          locale="en"
        />
      );
      cy.getBySel('no-results').should('exist');
      cy.getBySel('dataset-card').should('not.exist');
      cy.getBySel('fetch-error').should('not.exist');
    });
  });

  it('shows an error message if the search action fails', () => {
    cy.fixture('search-results/three-datasets.json').then(searchResult => {
      cy.intercept(
        {method: 'GET', url: '/api/datasets*'},
        {forceNetworkError: true}
      );
      cy.mount(
        <DatasetListWithTranslation
          initialSearchResult={searchResult}
          locale="en"
        />
      );
      cy.getBySel('fetch-error').should('exist');
      cy.getBySel('dataset-card').should('not.exist');
      cy.getBySel('no-results').should('not.exist');
    });
  });
});
