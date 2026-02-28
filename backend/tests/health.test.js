const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Health Check API', () => {
    // Increase timeout for DB connection
    jest.setTimeout(30000);

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return 200 OK for health check endpoint', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
    });
});
