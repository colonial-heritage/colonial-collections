describe('Object details page', () => {
  it('opens the object page if clicked on in the search list', () => {
    cy.visit('/en');
    // Get the name of the first object in the list.
    cy.getBySel('object-card-name')
      .first()
      .then($cardName => {
        // Navigate to the first object details page.
        cy.getBySel('object-card-name').first().click();
        // Wait for the page to load.
        cy.location('pathname', {timeout: 60000}).should('include', '/object');
        // On the details page.
        cy.getBySel('error').should('not.exist');
        cy.getBySel('no-entity').should('not.exist');
        cy.getBySel('page-title').then($detailsName => {
          expect($cardName.text()).equal($detailsName.text());
        });
      });
  });

  it('shows an error message if no object matches the ID', () => {
    cy.visit('/en/objects/anIdThatDoesNotExist');
    cy.getBySel('no-entity').should('exist');
    cy.getBySel('object-name').should('not.exist');
  });

  it('navigates back to the list with the previously selected filters', () => {
    cy.visit('/en');

    cy.getBySel('typesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.url()
      // Wait for the URL to contain the search param
      .should('contain', '?')
      .then(url => {
        // Open the details page
        cy.getBySel('object-card-name').first().click();
        // Go back to the list
        cy.getBySel('to-filtered-list-button').first().click();

        cy.url().should('eq', url);
        cy.getBySel('selectedFilter').should('have.length', 1);
      });
  });
});
