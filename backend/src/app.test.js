import request from 'supertest'
import app from './app.js'

describe('Health API', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.timestamp).toBeDefined()
  })
})
