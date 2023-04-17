describe('Research app homepage', () => {
  // Replace with real tests
  it('loads the page', () => {
    cy.visit('/en');
    cy.getBySel('error').should('not.exist');
  });
});
