describe('Dataset details page', () => {
  it('loads an existing dataset', () => {
    cy.visit('/en');
    // Get the name of the first dataset in the list.
    cy.getBySel('dataset-card-name')
      .first()
      .then($cardName => {
        // Navigate to the first dataset details page.
        cy.getBySel('dataset-card').first().click();
        // On the details page.
        cy.getBySel('dataset-name').then($detailsName => {
          expect($cardName.text()).equal($detailsName.text());
          cy.getBySel('no-dataset').should('not.exist');
        });
      });
  });

  it('will show an error message if no datasets can be found', () => {
    cy.visit('/en/dataset/anIdThatDoesNotExist');
    cy.getBySel('no-dataset').should('exist');
    cy.getBySel('dataset-name').should('not.exist');
  });
});
