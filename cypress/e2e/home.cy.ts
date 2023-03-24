describe('Dataset Browser homepage', () => {
  it('loads a dataset list', () => {
    cy.visit('/en');
    cy.getBySel('dataset-card-name').its('length').should('be.gt', 0);
  });
});

describe('Dataset list filters', () => {
  it('filters by one license', () => {
    cy.visit('/en');
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 1);
  });

  it('filters by two licenses', () => {
    cy.visit('/en');
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').eq(0).check();
      cy.get('[type="checkbox"]').eq(1).check();
    });

    cy.getBySel('selectedFilter').should('have.length', 2);
  });

  it('removes a license filter by deselecting the filter in the sidebar', () => {
    cy.visit('/en');
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().uncheck();
    });

    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('removes a license filter by deselecting it in the selected filter bar', () => {
    cy.visit('/en');
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').within(() => {
      cy.get('button').click();
    });

    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('filters by one publisher', () => {
    cy.visit('/en');
    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 1);
  });

  it('filters based on the search query', () => {
    cy.visit('/en');
    const searchText = 'My query';

    cy.getBySel('searchQuery').type(searchText);

    cy.getBySel('selectedFilter').should('have.length', 1);
    cy.getBySel('selectedFilter').should('have.text', searchText);
  });

  it('filters all categories together (query, license and publisher)', () => {
    cy.visit('/en');
    const searchText = 'My query';

    cy.getBySel('searchQuery').type(searchText);
    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });
    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 3);
  });
});
