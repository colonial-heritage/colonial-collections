// Because Clerk uses short-lived JWTs, it uses middleware that will re-load the JWT from a different page if necessary.
// This page might return a 401, so we need to tell Cypress to ignore the 401 and continue.
// Passing `failOnStatusCode: false` into `cy.visit` accomplishes just that.

describe('Object details page not signed in', () => {
  it('opens the object page if clicked on in the search list', () => {
    cy.visit('/objects', {
      failOnStatusCode: false,
      qs: {query: 'object'},
    });

    // Get the name of the first object in the list.
    cy.getBySel('object-card-name')
      .first()
      .then($cardName => {
        // Navigate to the first object details page.
        cy.getBySel('object-card').first().click();
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
    cy.visit('/en/objects/anIdThatDoesNotExist', {
      failOnStatusCode: false,
    });
    cy.getBySel('no-entity').should('exist');
    cy.getBySel('object-name').should('not.exist');
  });

  it('navigates back to the list with the previously selected filters', () => {
    cy.visit('/objects', {
      failOnStatusCode: false,
      qs: {query: 'object'},
    });

    cy.getBySel('typesFilter').within(() => {
      cy.get('[type="checkbox"]').first().check();
    });

    cy.url()
      // Wait for the URL to contain the search param
      .should('contain', 'types=')
      .then(url => {
        // Open the details page
        cy.getBySel('object-card').first().click();
        // Wait for the page to load.
        cy.location('pathname', {timeout: 60000}).should('include', '/object');
        // Go back to the list
        cy.getBySel('to-filtered-list-button').first().click();

        cy.url().should('eq', url);
        cy.getBySel('selectedFilter').should('have.length', 2);
      });
  });

  it('shows a text when hovering the add-to-list-button', () => {
    cy.task('getObjectUrl').then(url => {
      cy.visit(url as string, {
        failOnStatusCode: false,
      });

      cy.getBySel('add-to-list-button').trigger('mouseover');
      cy.getBySel('add-to-list-not-signed-in-panel').should('be.visible');
      cy.getBySel('add-to-list-signed-in-panel').should('not.exist');
    });
  });
});

describe('Object details page logged in', () => {
  beforeEach(() => {
    cy.task('resetDb');
    cy.task('createEmptyList').as('listId');
    cy.session('signed-in', () => cy.signIn());
  });

  it('adds an object to the list', function () {
    cy.task('getObjectUrl').then(url => {
      cy.visit(url as string, {
        failOnStatusCode: false,
      });

      cy.getBySel('add-to-list-button').trigger('mouseover');
      cy.getBySel(`object-list-${this.listId}`).click();
      cy.getBySel('notification').should('exist');

      cy.visit(
        `/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}/${this.listId}`,
        {
          failOnStatusCode: false,
        }
      );

      cy.getBySel('object-card').should('have.length', 1);
    });
  });

  it("opens the 'add enrichment' form", () => {
    cy.task('getObjectUrl').then(url => {
      cy.visit(url as string, {
        failOnStatusCode: false,
      });

      cy.getBySel('add-enrichment-button').first().click();
      cy.getBySel('enrichment-form').should('exist');
    });
  });
});
