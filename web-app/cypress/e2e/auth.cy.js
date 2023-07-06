describe('Login client', () => {
    it('Login with client account', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a').contains('Se connecter').click()

        cy.url().should('include', '/login')

        cy.get('#email').type('theodoresigaud@gmail.com')
        cy.get('#password').type('Azertyuiop')

        cy.get('button').contains('Se connecter').click()

        cy.url().should('eq', 'http://localhost:3000/')
    })
})