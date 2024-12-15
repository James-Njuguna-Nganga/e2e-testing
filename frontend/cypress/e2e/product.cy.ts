describe('Product Management - e2e Test', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('[data-testid=email]').type('farmer1@gmail.com');
      cy.get('[data-testid=password]').type('farmer123');
      cy.get('[data-testid=login-button]').click();
    });
  
    it('should allow a Farmer to add, edit, and delete their products', () => {
      
      cy.visit('/products/new');
      cy.get('[data-testid=product-title]').type('Product 1');
      cy.get('[data-testid=product-description]').type('Fresh organic tomatoes');
      cy.get('[data-testid=submit-button]').click();
      cy.contains('Product 1').should('exist');
  
      cy.contains('Product 1').click();
      cy.get('[data-testid=edit-button]').click();
      cy.get('[data-testid=product-title]').clear().type('Updated Product 1');
      cy.get('[data-testid=product-description]').clear().type('Fresh organic red tomatoes');
      cy.get('[data-testid=save-button]').click();
      cy.contains('Updated Product 1').should('exist'); 
  
      cy.contains('Updated Product 1').click();
      cy.get('[data-testid=delete-button]').click();
      cy.contains('Updated Product 1').should('not.exist');
    });
  });
  