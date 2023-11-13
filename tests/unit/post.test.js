// tests/unit/post.test.js

const request = require('supertest');
const crypto = require('crypto');
const app = require('../../src/app');
require('dotenv').config();
const url = process.env.API_URL;

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect').expect(401));

  // test with valid credentials amd should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // If the type is not supported, it should fail
  test('unsupported type fails', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'application/html');
    expect(res.statusCode).toBe(415);
  });

  // req without body fails
  test('fragment without data does not work', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send();
    expect(res.statusCode).toBe(500);
  });

  //req with body passes
  test('fragment with data works', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment with data works');

    var data = JSON.parse(res.text);
    var user1 = crypto.createHash('sha256').update('user1@email.com').digest('hex');

    expect(res.statusCode).toBe(201);
    expect(data.fragment.type).toBe('text/plain');
    expect(data.fragment.size).toBe(24);
    expect(data.fragment.ownerId).toBe(user1);
    expect(res.text).toContain('ownerId');
    expect(res.text).toContain('id');
    expect(res.text).toContain('type');
    expect(res.text).toContain('created');
    expect(res.text).toContain('updated');
  });

  // responses include a Location header with a URL to GET the fragment
  test('responses include a Location header with a URL to GET the fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('responses include a Location header with a URL to GET the fragment');

    var data = JSON.parse(res.text);
    var id = data.fragment.id;

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toBe(`${url}/v1/fragments/${id}`);
  });

  test('returns 500 status code when there is an internal server error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', '') // sending null content-type to simulate malformed request data
      .send(null); // sending null body to simulate malformed request data

    expect(res.statusCode).toBe(500);
  });
});
