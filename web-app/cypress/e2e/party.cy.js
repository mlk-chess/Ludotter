describe('Create party', () => {
    it('Create a new party and fill mandatory fields', () => {
        const name = 'Soirée code names'
        const location = 'Paris'
        const description = 'Soirée jeu de carte'
        const players = 5
        const date = '2024-05-12'
        const zipCode = 75012
        const time = '20:00'

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

        cy.get('a').contains('Parties').click()

        cy.url().should('include', '/party')
        cy.get('a').contains('Créer une soirée').click()

        cy.get('#name').type(name)
        cy.get('#city').type(location)
        cy.get('#description').type(description)
        cy.get('#players').type(players)
        cy.get('#time').type(time)
        cy.get('#zipcode').type(zipCode)
        cy.get('#date').type(date)

        cy.get('button').contains('Créer').click()

        cy.get('span').should('contain', 'Votre fête a bien été créée ! Un administrateur va la valider dans les plus brefs délais.')
    })
    
    it('Check if values are correct for a party', () => {
            // const url = Cypress.env('url')

            // cy.visit(url)

            // cy.get('a').contains('Parties').click()

            // cy.url().should('include', '/party')
            // cy.get('#list-party').should('be.visible')
            // cy.get('#list-party').should('have.length', [1])

            // cy.intercept('GET', '/party').as('getSoirees');
            // cy.visit('/party');
            // cy.get('#nameParty').should('contain', `${item.name}`)
            // cy.get('#descriptionParty').should('contain', 'red, tes tout red')
            // cy.get('#timeParty').should('contain', '')
            // cy.get('#zipcodeParty').should('contain', '75012')
            // cy.get('#dateParty').should('contain', '75012')
            // cy.get('#locationParty').should('contain', 'Paris12ds')
    })
})