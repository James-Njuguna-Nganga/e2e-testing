describe('Register Component', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('shows an error if fields are empty', () => {
      cy.get('form').submit();
      cy.contains('All fields are required').should('be.visible');
    });
  
    it('validates email format', () => {
      cy.get('#email').type('invalidEmail');
      cy.get('form').submit();
      cy.contains('Please enter a valid email').should('be.visible');
    });
  
    it('validates password length', () => {
      cy.get('#password').type('short');
      cy.get('form').submit();
      cy.contains('Password must be at least 8 characters').should('be.visible');
    });
  
    it('validates phone number format', () => {
      cy.get('#phoneNumber').type('0799619817');
      cy.get('form').submit();
      cy.contains('Please enter a valid phone number (+254...)').should('be.visible');
    });
  
    it('registers successfully with valid inputs', () => {
      cy.intercept('POST', '/api/register', { statusCode: 200, body: { message: 'Registration successful' } }).as('register');
  
      cy.get('#email').type('jimmy@gmail.com');
      cy.get('#password').type('jimmy254');
      cy.get('#firstName').type('Jimmy');
      cy.get('#lastName').type('James');
      cy.get('#phoneNumber').type('+254799619817');
      cy.get('form').submit();
  
      cy.wait('@register');
      cy.contains('Registration successful').should('be.visible');
      cy.url().should('include', '/login');
    });
  
    it('displays error on API failure', () => {
      cy.intercept('POST', '/api/register', { statusCode: 400, body: { message: 'Email already registered' } }).as('register');
  
      cy.get('#email').type('jimmy@gmail.com');
      cy.get('#password').type('jimmy254');
      cy.get('#firstName').type('Jimmy');
      cy.get('#lastName').type('James');
      cy.get('#phoneNumber').type('+254799619817');
      cy.get('form').submit();
  
      cy.wait('@register');
      cy.contains('Email already registered').should('be.visible');
    });
  });
   