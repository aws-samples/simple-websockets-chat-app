describe('Home', () => {
  ['new chat', 'Get Started', 'Start for free'].forEach(cta => {
    it(`should display "${cta}" cta and take me to a new room`, () => {
      cy.visit('/')
      cy.contains(cta).click()

      cy.get('form input[type=text]')
        .type('Hola')
        .should('have.value', 'Hola')
        .type('{enter}')
        .should('have.value', '')
      cy.contains('Hola')

      cy.reload()
      cy.contains('Hola').should('not.exist')

      cy.contains('Invite others')
      cy.contains('Copy link') // Paste functionality can't be tested atm
      cy.url()
        .then(url => cy.get('img').should('have.attr', 'alt', url))
    })
  })
})
