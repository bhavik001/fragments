// tests/unit/put.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('updates a fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    const id = postRes.headers.location.split('/').pop();
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is an updated fragment');
    expect(putRes.statusCode).toBe(201);

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toEqual('This is an updated fragment');
  });

  test('updating a fragment that does not exist returns 404', async () => {
    const res = await request(app)
      .put('/v1/fragments/invalid_id')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is an updated fragment');
    expect(res.statusCode).toBe(404);
  });

  test('updating a fragment with a different content type returns 400', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    const id = postRes.headers.location.split('/').pop();
    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('This is an updated fragment');
    expect(res.statusCode).toBe(400);
  });
});
