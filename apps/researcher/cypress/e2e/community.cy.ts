describe('Community details page', () => {
  it('opens the community page if clicked on in the communities list', () => {
    cy.visit('/communities', {
      failOnStatusCode: false,
    });
    // Get the name of the first community in the list.
    cy.getBySel('community-item-name')
      .first()
      .then($name => {
        // Navigate to the first community details page.
        cy.getBySel('community-item-name').first().find('a').click();
        // Wait for the page to load.
        cy.location('pathname', {timeout: 60000}).should(
          'include',
          '/communities/'
        );
        // On the details page.
        cy.getBySel('error').should('not.exist');
        cy.getBySel('no-entity').should('not.exist');
        cy.getBySel('community-name').then($detailsName => {
          expect($name.text()).equal($detailsName.text());
        });
      });
  });

  it('shows an error message if no community matches the ID', () => {
    cy.visit('/communities/anIdThatDoesNotExist', {
      failOnStatusCode: false,
    });
    cy.getBySel('no-entity').should('exist');
    cy.getBySel('community-name').should('not.exist');
  });
});
