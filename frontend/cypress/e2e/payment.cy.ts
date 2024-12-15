describe('Payment Initiation - e2e Test', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('[data-testid=email]').type('buyer1@gmail.com');
      cy.get('[data-testid=password]').type('buyer123');
      cy.get('[data-testid=login-button]').click();
    });
  
    it('should initiate a payment and handle the response', () => {
      cy.visit('/products');
      cy.contains('Fresh Organic Tomatoes').click();
      cy.get('[data-testid=add-to-cart-button]').click();
  
      cy.get('[data-testid=cart-icon]').click();
      cy.get('[data-testid=checkout-button]').click();
  
      cy.get('[data-testid=payment-method]').select('M-Pesa');
      cy.get('[data-testid=initiate-payment-button]').click();
  
      cy.intercept('POST', '/api/payment/initiate', {
        statusCode: 200,
        body: { status: 'success', transactionId: 'TX12345' },
      }).as('initiatePayment');
  
      cy.wait('@initiatePayment').its('response.statusCode').should('eq', 200);
      cy.contains('Payment Successful').should('exist');
      cy.get('[data-testid=order-status]').should('contain', 'Paid');
    });
  
    it('should handle payment failure gracefully', () => {
      cy.visit('/products');
      cy.contains('Fresh Organic Tomatoes').click();
      cy.get('[data-testid=add-to-cart-button]').click();
      cy.get('[data-testid=cart-icon]').click();
      cy.get('[data-testid=checkout-button]').click();
  
      cy.get('[data-testid=payment-method]').select('M-Pesa');
      cy.get('[data-testid=initiate-payment-button]').click();
  
    
      cy.intercept('POST', '/api/payment/initiate', {
        statusCode: 400,
        body: { status: 'failure', message: 'Payment failed' },
      }).as('initiatePayment');
  
      cy.wait('@initiatePayment').its('response.statusCode').should('eq', 400);
  
      cy.contains('Payment Failed').should('exist');
      cy.get('[data-testid=order-status]').should('contain', 'Unpaid');
    });
  });
  