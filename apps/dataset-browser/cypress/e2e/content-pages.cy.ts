describe('Content pages', () => {
  it('loads the contact page', () => {
    cy.visit('/contact');
    cy.getBySel('markdown-container').should('exist');
    cy.getBySel('error').should('not.exist');
  });

  it('loads the about page', () => {
    cy.visit('/about');
    cy.getBySel('markdown-container').should('exist');
    cy.getBySel('error').should('not.exist');
  });

  it('loads the faq page', () => {
    cy.visit('/faq');
    cy.getBySel('markdown-container').should('exist');
    cy.getBySel('error').should('not.exist');
  });
});
