describe('Root Page', () => {
  it('visits root and checks content', () => {
    cy.visit('/')
    cy.contains('h1', 'Vite + Vue')
  })
})
