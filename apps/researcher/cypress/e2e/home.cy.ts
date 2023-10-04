// Because Clerk uses short-lived JWTs, it uses middleware that will re-load the JWT from a different page if necessary.
// This page might return a 401, so we need to tell Cypress to ignore the 401 and continue.
// Passing `failOnStatusCode: false` into `cy.visit` accomplishes just that.

describe('Researcher homepage', () => {
  it('shows an object list', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    cy.getBySel('error').should('not.exist');
    cy.getBySel('object-card').its('length').should('be.gt', 0);
  });
});

describe('Object list filters', () => {
  it('filters by one material', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    cy.getBySel('materialsFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 1);
  });

  it('filters by two materials', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    cy.getBySel('materialsFilter').within(() => {
      cy.get('[type="checkbox"]').eq(0).check();
      cy.get('[type="checkbox"]').eq(1).check();
    });

    cy.getBySel('selectedFilter').should('have.length', 2);
  });

  it('removes a material filter by deselecting the filter in the sidebar', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    cy.getBySel('materialsFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('materialsFilter').within(() => {
      cy.get('[type="checkbox"]').first().uncheck();
    });

    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('removes a material filter by deselecting it in the selected filter bar', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    cy.getBySel('materialsFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').within(() => {
      cy.get('button').click();
    });

    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('filters by one type', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    cy.getBySel('typesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 1);
  });

  it('filters based on the search query', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    const searchText = 'My query';

    cy.getBySel('searchQuery').type(searchText);

    cy.getBySel('selectedFilter').should('have.length', 1);
    cy.getBySel('selectedFilter').should('have.text', searchText);
  });

  it('filters multiple categories together (query, materials and types)', () => {
    cy.visit('/en', {
      failOnStatusCode: false,
    });
    const searchText = 'My query';

    cy.getBySel('searchQuery').type(searchText);
    cy.getBySel('typesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });
    cy.getBySel('materialsFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 3);
  });
});
