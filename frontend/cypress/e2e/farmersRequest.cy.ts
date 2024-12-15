describe('Farmer Requests Management - e2e Test', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('[data-testid=email]').type('admin1@gmail.com');
      cy.get('[data-testid=password]').type('admin123');
      cy.get('[data-testid=login-button]').click();
    });
  
    it('should approve and reject farmer requests', () => {
      cy.visit('/admin/farmer-requests');
      cy.url().should('include', '/admin/farmer-requests');

      cy.contains('Pending Farmer Request 1')
        .parents('[data-testid=farmer-request-row]')
        .within(() => {
          cy.get('[data-testid=approve-button]').click();
        });
      cy.contains('Pending Farmer Request 1').should('not.exist'); 

      cy.contains('Pending Farmer Request 2')
        .parents('[data-testid=farmer-request-row]')
        .within(() => {
          cy.get('[data-testid=reject-button]').click();
        });
      cy.contains('Pending Farmer Request 2').should('not.exist'); 
  
      cy.visit('/admin/farmer-approved');
      cy.contains('Approved Farmer Request 1').should('exist');
      
      cy.visit('/admin/farmer-rejected');
      cy.contains('Rejected Farmer Request 2').should('exist');
    });
  });
  