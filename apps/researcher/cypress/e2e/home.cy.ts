describe('Researcher homepage', () => {
  it('shows an object list', () => {
    cy.visit('/en');
    cy.getBySel('error').should('not.exist');
    cy.getBySel('object-card-name').its('length').should('be.gt', 0);
  });
});

describe('Object list filters', () => {
  it('filters by one owner', () => {
    cy.visit('/en');
    cy.getBySel('ownersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 1);
  });

  it('filters by two owners', () => {
    cy.visit('/en');
    cy.getBySel('ownersFilter').within(() => {
      cy.get('[type="checkbox"]').eq(0).check();
      cy.get('[type="checkbox"]').eq(1).check();
    });

    cy.getBySel('selectedFilter').should('have.length', 2);
  });

  it('removes an owner filter by deselecting the filter in the sidebar', () => {
    cy.visit('/en');
    cy.getBySel('ownersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('ownersFilter').within(() => {
      cy.get('[type="checkbox"]').first().uncheck();
    });

    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('removes an owner filter by deselecting it in the selected filter bar', () => {
    cy.visit('/en');
    cy.getBySel('ownersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').within(() => {
      cy.get('button').click();
    });

    cy.getBySel('selectedFilter').should('have.length', 0);
  });

  it('filters by one type', () => {
    cy.visit('/en');
    cy.getBySel('typesFilter').within(() => {
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

  it('filters multiple categories together (query, owners and types)', () => {
    cy.visit('/en');
    const searchText = 'My query';

    cy.getBySel('searchQuery').type(searchText);
    cy.getBySel('typesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });
    cy.getBySel('ownersFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.getBySel('selectedFilter').should('have.length', 3);
  });
});
