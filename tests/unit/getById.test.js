// tests/unit/getById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated users get fragment data with the given id', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const id = postRes.headers.location.split('/').pop();
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(data.toString());
  });

  // Invalid id should return 404
  test('invalid id returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid_id')
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /v1/fragments/:id.ext', () => {
  test('invalid extension returns 415', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);

    const id = postRes.headers.location.split('/').pop();

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.invalid`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(415);
  });

  const cheerio = require('cheerio');

  test('.md to .html', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);

    const id = postRes.headers.location.split('/').pop();

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toMatch(/text\/html/);
    const $ = cheerio.load(getRes.text);
    expect($('body').length).toBeGreaterThan(0);
  });

  test('.md to .txt', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);

    const id = postRes.headers.location.split('/').pop();

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toMatch(/text\/plain/);
    expect(getRes.text).toBe(data.toString());
  });

  test('.html to .txt', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);

    const id = postRes.headers.location.split('/').pop();

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toMatch(/text\/plain/);
    expect(getRes.text).toBe(data.toString());
  });

  test('.application/json to .txt', async () => {
    const data = Buffer.from('{"This": "is fragment"}');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);

    const id = postRes.headers.location.split('/').pop();

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toMatch(/text\/plain/);
  });
});
