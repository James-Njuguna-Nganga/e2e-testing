describe('Login', () => {
  it('should login sucessfully', () => {
    cy.visit('/login')

    cy.get('#email').type('earljoe06@outlook.com')
    cy.get('#password').type('eaw111hh')
    cy.get('#login-form').submit()

    cy.url().should('include', '/home')

    cy.contains('Learn more').click()
    cy.url().should('include', '/about')

  })
})

