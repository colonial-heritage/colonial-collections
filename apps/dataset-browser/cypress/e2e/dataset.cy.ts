describe('Dataset details page', () => {
  it('loads an existing dataset', () => {
    cy.visit('/en');
    // Get the name of the first dataset in the list.
    cy.getBySel('dataset-card-name')
      .first()
      .then($cardName => {
        // Navigate to the first dataset details page.
        cy.getBySel('dataset-card-name').first().click();
        // Wait for the page to load.
        cy.location('pathname', {timeout: 60000}).should('include', '/dataset');
        // On the details page.
        cy.getBySel('error').should('not.exist');
        cy.getBySel('page-title').then($detailsName => {
          expect($cardName.text()).equal($detailsName.text());
          cy.getBySel('no-dataset').should('not.exist');
        });
      });
  });

  it('shows an error message if no dataset can be found', () => {
    cy.visit('/en/datasets/anIdThatDoesNotExist');
    cy.getBySel('no-dataset').should('exist');
    cy.getBySel('dataset-name').should('not.exist');
  });

  it('navigates back to the list with the previously selected filters', () => {
    cy.visit('/en');

    cy.getBySel('licensesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.url()
      // Wait for the URL to contain the search param
      .should('contain', '?')
      .then(url => {
        // Open the details page
        cy.getBySel('dataset-card-name').first().click();
        // Go back to the list
        cy.getBySel('to-filtered-list-button').first().click();

        cy.url().should('eq', url);
        cy.getBySel('selectedFilter').should('have.length', 1);
      });
  });
});
