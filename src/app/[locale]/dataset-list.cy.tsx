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

describe('Dataset list filters', () => {
  beforeEach(function () {
    cy.fixture('search-results/three-datasets.json').then(searchResult => {
      this.searchResult = searchResult;
      cy.intercept({method: 'GET', url: '/api/datasets?*'}, searchResult);
      cy.mount(
        <DatasetListWithTranslation
          initialSearchResult={searchResult}
          locale="en"
        />
      );
    });
  });

  it('can filter by one license', function () {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/datasets?licenses=${encodeURIComponent(
          this.searchResult.filters.licenses[0].id
        )}`,
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilterTag').should('have.length', 1);
    cy.getBySel('selectedFilterTag').should(
      'have.text',
      this.searchResult.filters.licenses[0].name
    );
  });

  it('can filter by two licenses', function () {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/datasets?licenses=${encodeURIComponent(
          [
            this.searchResult.filters.licenses[0].id,
            this.searchResult.filters.licenses[1].id,
          ].join()
        )}`,
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').eq(0).check();
      cy.get('[type="checkbox"]').eq(1).check();
    });

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilterTag').should('have.length', 2);
    cy.getBySel('selectedFilterTag')
      .eq(0)
      .should('have.text', this.searchResult.filters.licenses[0].name);
    cy.getBySel('selectedFilterTag')
      .eq(1)
      .should('have.text', this.searchResult.filters.licenses[1].name);
  });

  it('can remove a license filter by deselecting the filter in the sidebar', () => {
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/datasets?',
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().uncheck();
    });

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilterTag').should('have.length', 0);
  });

  it('can remove a license filter by deselecting it in the selected filter bar', () => {
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/datasets?',
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('removeSelectedFilter').click();

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilterTag').should('have.length', 0);
  });

  it('can filter by one publisher', function () {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/datasets?publishers=${encodeURIComponent(
          this.searchResult.filters.publishers[0].id
        )}`,
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilterTag').should('have.length', 1);
    cy.getBySel('selectedFilterTag').should(
      'have.text',
      this.searchResult.filters.publishers[0].name
    );
  });

  it('can filter based on the search query', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/datasets?query=My+query',
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('searchQuery').type('My query');

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilterTag').should('have.length', 1);
    cy.getBySel('selectedFilterTag').should('have.text', 'My query');
  });

  it('can filter all categories together (query, license and publisher)', function () {
    cy.intercept(
      {
        method: 'GET',
        url: `/api/datasets?query=My+query&licenses=${encodeURIComponent(
          this.searchResult.filters.licenses[0].id
        )}&publishers=${encodeURIComponent(
          this.searchResult.filters.publishers[0].id
        )}`,
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('searchQuery').type('My query');
    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilterTag').should('have.length', 3);
  });
});
