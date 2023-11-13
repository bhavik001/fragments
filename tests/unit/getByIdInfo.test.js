// tests/unit/getByIdInfo.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id/info').expect(401));

  // Correct credentials should give a success result with metadata about the fragment with the given id
  test('authenticated users get metadata about the fragment with the given id', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const id = postRes.headers.location.split('/').pop();
    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment.id).toBe(id);
    expect(getRes.body.fragment.type).toBe('text/plain');
    expect(getRes.body.fragment.size).toBe(data.length);
    expect(getRes.body.fragment.created).toBeTruthy();
    expect(getRes.body.fragment.updated).toBeTruthy();
    expect(getRes.body.fragment.ownerId).toBeTruthy();
  });

  // Invalid id should return 404
  test('invalid id returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid_id/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});
