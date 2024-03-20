describe('Communities page', () => {
  it('shows a list of communities', () => {
    cy.visit('/communities', {
      failOnStatusCode: false,
    });

    cy.getBySel('community-item-name').should('exist');
    cy.getBySel('error').should('not.exist');
  });
});

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
        $name.parentsUntil('a').click();
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

describe('Communities page logged in', () => {
  beforeEach(() => {
    cy.session('signed-in', () => cy.signIn());
  });

  it("opens the 'add community' modal", () => {
    cy.visit('/en/communities', {
      failOnStatusCode: false,
    });

    cy.getBySel('add-community').click();
    // It's not possible to add test IDs to the model, so we're using the h1 instead
    cy.get('h1').contains('Create Community');
  });

  it('finds my community with the "Show only my communities" toggle', () => {
    cy.visit('/en/communities', {
      failOnStatusCode: false,
    });

    cy.getBySel('my-community-toggle').click();
    cy.getBySel('community-item-name').should('have.length', 1);
  });
});

describe('Community details page logged in', () => {
  beforeEach(() => {
    cy.session('signed-in', () => cy.signIn());
  });

  it('edits my community', () => {
    const uniqueIdentifier = Date.now();

    cy.visit(`/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}`, {
      failOnStatusCode: false,
    });
    cy.getBySel('edit-community').click();
    cy.get('#description')
      .clear()
      .type(
        `This community is used for end-to-end testing; please do not remove or use this community. Unique Identifier: ${uniqueIdentifier}`
      );
    cy.getBySel('save-button').click();

    cy.getBySel('notification').should('exist');
    cy.contains(uniqueIdentifier).should('exist');
  });

  it('opens the manage user modal', () => {
    cy.visit(`/en/communities${Cypress.env('TEST_COMMUNITY_SLUG')}`, {
      failOnStatusCode: false,
    });
    cy.getBySel('manage-members-button').click();
    cy.get('h1').contains('Members');
  });
});
