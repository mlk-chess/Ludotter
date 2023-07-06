describe('Login client', () => {
    it('Login with client account', () => {
        cy.log(Cypress.env('email'))
        const email = Cypress.env('email')
        const password = Cypress.env('password')
        const url = Cypress.env('url')

        cy.visit(url)

        cy.get('a').contains('Se connecter').click()

        cy.url().should('include', '/login')

        cy.get('#email').type(email)
        cy.get('#password').type(password)

        cy.get('button').contains('Se connecter').click()

        cy.url().should('eq', `${url}/`)
    })
})