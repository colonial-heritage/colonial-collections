describe('Object lists not logged in', () => {
  it('opens the object list from the community page', () => {
    cy.task('resetDb');
    cy.task('createEmptyList').then(listId => {
      cy.visit(`/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}`, {
        failOnStatusCode: false,
      });
      // Get the name of the first community in the list.
      cy.getBySel('object-list-item').first().click();

      cy.location('pathname', {timeout: 60000}).should(
        'eq',
        `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}/${listId}`
      );
      cy.getBySel('error').should('not.exist');
      cy.getBySel('no-entity').should('not.exist');
    });
  });

  it('shows an error message if no community matches the ID', () => {
    cy.visit(
      `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}/1234567890`,
      {
        failOnStatusCode: false,
      }
    );
    cy.getBySel('no-entity').should('exist');
    cy.getBySel('error').should('not.exist');
  });
});

describe('Object lists on community page logged in', () => {
  beforeEach(() => {
    cy.task('resetDb');
    cy.session('signed-in', () => cy.signIn());
  });

  it('adds a list', () => {
    cy.visit(`/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}`, {
      failOnStatusCode: false,
    });
    cy.getBySel('object-list-item').should('have.length', 0);
    cy.getBySel('add-object-list-button').click();
    cy.get('#name').type('Test List');
    cy.get('#description').type(
      'This list is used for end-to-end testing; please do not remove or use this list'
    );
    cy.getBySel('save-button').click();
    cy.getBySel('notification').should('exist');
    cy.getBySel('object-list-item').should('have.length', 1);
  });
});

describe('Object list page logged in', () => {
  beforeEach(() => {
    cy.task('resetDb');
    cy.task('createEmptyList').as('listId');
    cy.session('signed-in', () => cy.signIn());
  });

  it('edits the list name and description', function () {
    cy.visit(
      `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}/${this.listId}`,
      {
        failOnStatusCode: false,
      }
    );

    cy.getBySel('edit-list-button').click();
    cy.get('#name').type(' Edited');
    cy.getBySel('save-button').click();
    cy.getBySel('notification').should('exist');
    cy.contains('Edited').should('exist');
  });

  it('deletes the object list', function () {
    cy.visit(
      `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}/${this.listId}`,
      {
        failOnStatusCode: false,
      }
    );

    cy.getBySel('edit-list-button').click();
    cy.getBySel('delete-list-button').click();
    cy.getBySel('delete-list-confirm-button').click();

    cy.location('pathname', {timeout: 60000}).should(
      'eq',
      `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}`
    );

    cy.visit(
      `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}/${this.listId}`,
      {
        failOnStatusCode: false,
      }
    );

    cy.getBySel('no-entity').should('exist');
  });

  it('deletes an object from the list', function () {
    cy.task('addObjectsToList', {numberOfObject: 3, listId: this.listId});

    cy.visit(
      `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}/${this.listId}`,
      {
        failOnStatusCode: false,
      }
    );

    cy.getBySel('delete-object-button').should('not.exist');
    cy.getBySel('manage-items-button').click();
    cy.getBySel('delete-object-button').should('have.length', 3);
    cy.getBySel('delete-object-button').first().click();
    cy.getBySel('notification').should('exist');
    cy.getBySel('delete-object-button').should('have.length', 2);
  });
});
