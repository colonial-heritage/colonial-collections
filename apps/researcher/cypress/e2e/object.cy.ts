describe('Object details page', () => {
  it('loads an existing object', () => {
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
        cy.getBySel('page-title').then($detailsName => {
          expect($cardName.text()).equal($detailsName.text());
          cy.getBySel('no-object').should('not.exist');
        });
      });
  });

  it('shows an error message if no object can be found', () => {
    cy.visit('/en/object/anIdThatDoesNotExist');
    cy.getBySel('no-object').should('exist');
    cy.getBySel('object-name').should('not.exist');
  });
});
