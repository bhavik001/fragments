const request = require('supertest');
const app = require('../../src/app');

describe('404 middleware', () => {
  it('returns a 404 status and error message for a non-existent resource', async () => {
    const response = await request(app).get('/nonexistent-resource');
    expect(response.status).toEqual(404);
    expect(response.body.status).toEqual('error');
    expect(response.body.error.message).toEqual('not found');
    expect(response.body.error.code).toEqual(404);
  });
});
