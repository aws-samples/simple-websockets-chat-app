describe('Home', () => {
  ['new chat', 'Get Started', 'Start for free'].forEach(cta => {
    it(`should display "${cta}" cta and take me to a new room`, () => {
      cy.visit('/')
      cy.contains(cta).click()

      cy.get('input[type=text]')
        .type('Hola')
        .should('have.value', 'Hola')
        .type('{enter}')
        .should('have.value', '')

      cy.contains('Hola')
    })
  })
})
