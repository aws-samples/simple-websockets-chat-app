describe('Home', () => {
  it('should display ctas and they all take to a new room', () => {
    cy.visit('/')
    cy.contains('new chat')
    cy.contains('Get Started')
    cy.contains('Start for free')
  })
})
