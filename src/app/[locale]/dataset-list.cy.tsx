import DatasetList, {Props} from './dataset-list';
import {NextIntlClientProvider} from 'next-intl';
import messages from '@/messages/en.json';
import {SearchResult} from '@/lib/dataset-fetcher';

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
  beforeEach(() => {
    cy.fixture('search-results/three-datasets.json')
      .as('searchResult')
      .then(searchResult => {
        cy.intercept({method: 'GET', url: '/api/datasets?*'}, searchResult);
        cy.mount(
          <DatasetListWithTranslation
            initialSearchResult={searchResult}
            locale="en"
          />
        );
      });
  });

  it('filters by one license', () => {
    cy.get<SearchResult>('@searchResult').then(searchResult => {
      const filterRequestUrl =
        '/api/datasets?' +
        new URLSearchParams({
          licenses: searchResult.filters.licenses[0].id,
        });
      cy.intercept(
        {
          method: 'GET',
          url: filterRequestUrl,
        },
        cy.spy().as('filterRequest')
      );

      cy.getBySel('licensesFilter').within(() => {
        cy.get('[type="checkbox"]').first().check();
      });

      cy.get('@filterRequest').should('have.been.called');
      cy.getBySel('selectedFilter').should('have.length', 1);
      cy.getBySel('selectedFilter').should(
        'have.text',
        searchResult.filters.licenses[0].name
      );
    });
  });

  it('filters by two licenses', () => {
    cy.get<SearchResult>('@searchResult').then(searchResult => {
      const filterRequestUrl =
        '/api/datasets?' +
        new URLSearchParams({
          licenses: [
            searchResult.filters.licenses[0].id,
            searchResult.filters.licenses[1].id,
          ].join(),
        });
      cy.intercept(
        {
          method: 'GET',
          url: filterRequestUrl,
        },
        cy.spy().as('filterRequest')
      );

      cy.getBySel('licensesFilter').within(() => {
        cy.get('[type="checkbox"]').eq(0).check();
        cy.get('[type="checkbox"]').eq(1).check();
      });

      cy.get('@filterRequest').should('have.been.called');
      cy.getBySel('selectedFilter').should('have.length', 2);
      cy.getBySel('selectedFilter')
        .eq(0)
        .should('have.text', searchResult.filters.licenses[0].name);
      cy.getBySel('selectedFilter')
        .eq(1)
        .should('have.text', searchResult.filters.licenses[1].name);
    });
  });

  it('removes a license filter by deselecting the filter in the sidebar', () => {
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
    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('removes a license filter by deselecting it in the selected filter bar', () => {
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

    cy.getBySel('selectedFilter').within(() => {
      cy.get('button').click();
    });

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('filters by one publisher', () => {
    cy.get<SearchResult>('@searchResult').then(searchResult => {
      const filterRequestUrl =
        '/api/datasets?' +
        new URLSearchParams({
          publishers: searchResult.filters.publishers[0].id,
        });
      cy.intercept(
        {
          method: 'GET',
          url: filterRequestUrl,
        },
        cy.spy().as('filterRequest')
      );

      cy.getBySel('publishersFilter').within(() => {
        cy.get('[type="checkbox"]').first().check();
      });

      cy.get('@filterRequest').should('have.been.called');
      cy.getBySel('selectedFilter').should('have.length', 1);
      cy.getBySel('selectedFilter').should(
        'have.text',
        searchResult.filters.publishers[0].name
      );
    });
  });

  it('filters based on the search query', () => {
    const searchText = 'My query';
    const filterRequestUrl =
      '/api/datasets?' +
      new URLSearchParams({
        query: searchText,
      });
    cy.intercept(
      {
        method: 'GET',
        url: filterRequestUrl,
      },
      cy.spy().as('filterRequest')
    );

    cy.getBySel('searchQuery').type(searchText);

    cy.get('@filterRequest').should('have.been.called');
    cy.getBySel('selectedFilter').should('have.length', 1);
    cy.getBySel('selectedFilter').should('have.text', searchText);
  });

  it('filters all categories together (query, license and publisher)', () => {
    cy.get<SearchResult>('@searchResult').then(searchResult => {
      const searchText = 'My query';
      const filterRequestUrl =
        '/api/datasets?' +
        new URLSearchParams({
          query: searchText,
          licenses: searchResult.filters.licenses[0].id,
          publishers: searchResult.filters.publishers[0].id,
        });
      cy.intercept(
        {
          method: 'GET',
          url: filterRequestUrl,
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
      cy.getBySel('selectedFilter').should('have.length', 3);
    });
  });
});
