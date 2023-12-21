// Because Clerk uses short-lived JWTs, it uses middleware that will re-load the JWT from a different page if necessary.
// This page might return a 401, so we need to tell Cypress to ignore the 401 and continue.
// Passing `failOnStatusCode: false` into `cy.visit` accomplishes just that.

describe('Researcher homepage', () => {
  it('shows the object list after searching', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    cy.getBySel('searchQuery').type('object');
    cy.getBySel('searchQuery').next('button').click();
    cy.location('search', {timeout: 60000}).should('include', '?query=');

    cy.getBySel('error').should('not.exist');
    cy.getBySel('object-card').its('length').should('be.gt', 0);
  });
});

describe('Object list filters', () => {
  it('filters based on the search query', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    const searchText = 'My query';

    cy.getBySel('searchQuery').type(searchText);
    cy.getBySel('searchQuery').next('button').click();
    cy.location('search', {timeout: 60000}).should('include', '?query=');

    cy.getBySel('selectedFilter').should('have.length', 1);
    cy.getBySel('selectedFilter').should('have.text', searchText);
  });

  it('filters by one publisher', () => {
    cy.visit('/objects', {
      failOnStatusCode: false,
      qs: {query: 'object'},
    });

    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 2);
  });

  it('filters by two materials', () => {
    cy.visit('/objects', {
      failOnStatusCode: false,
      qs: {query: 'object'},
    });

    cy.getBySel('materialsFilter').within(() => {
      cy.get('[type="checkbox"]').eq(0).check();
      cy.get('[type="checkbox"]').eq(1).check();
    });

    cy.getBySel('selectedFilter').should('have.length', 3);
  });

  it('removes a publisher filter by deselecting the filter in the sidebar', () => {
    cy.visit('/objects', {
      failOnStatusCode: false,
      qs: {query: 'object'},
    });

    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().uncheck();
    });

    cy.getBySel('selectedFilter').should('have.length', 1);
  });

  it('removes a publisher filter by deselecting it in the selected filter bar', () => {
    cy.visit('/objects', {
      failOnStatusCode: false,
      qs: {query: 'object'},
    });

    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter')
      .first()
      .within(() => {
        cy.get('button').click();
      });

    cy.getBySel('selectedFilter').should('have.length', 1);
  });

  it('filters by one type', () => {
    cy.visit('/objects', {
      failOnStatusCode: false,
      qs: {query: 'object'},
    });
    cy.getBySel('typesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 2);
  });

  it('filters multiple categories together (query, publishers and types)', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    const searchText = 'object';

    cy.getBySel('searchQuery').type(searchText);
    cy.getBySel('searchQuery').next('button').click();
    cy.location('search', {timeout: 60000}).should('include', '?query=');

    cy.getBySel('typesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('publishersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 3);
  });
});
