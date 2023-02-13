describe('Dataset browser homepage', () => {
  it('loads a dataset list', () => {
    cy.visit('/');
    cy.getBySel('dataset-card').its('length').should('be.gt', 0);
  });
});
