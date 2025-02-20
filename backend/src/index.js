import app from './app.js'

const port = 3000

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

export default server
