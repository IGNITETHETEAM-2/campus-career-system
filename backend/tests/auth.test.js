const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth API', () => {
  jest.setTimeout(30000);

  const uniqueEmail = `tester_${Date.now()}@example.com`;
  const password = 'Secret123!';
  let token;

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'API Tester',
        email: uniqueEmail,
        password,
        role: 'student'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', uniqueEmail);
  });

  it('should login and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should get current user profile with bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', uniqueEmail);
    expect(res.body).toHaveProperty('role', 'student');
  });
});
