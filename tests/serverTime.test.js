const request = require('supertest');
const {app, server} = require('../index');
const {getCurrentServerTime} = require('../utils/time');

// Unit test to check util function to get time
describe('getCurrentServerTime', () => {
    it('should return the current server time in the correct format', () => {
        const currentTime = getCurrentServerTime();
        const parsedDate = new Date(currentTime);
        expect(parsedDate.toString()).not.toBe('Invalid Date');
    });
});

// Checks for current server time
describe('GET /server-time', () => {
    it('should return the current server time', async () => {
        const res = await request(app).get('/server-time');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
        expect(res.body).toHaveProperty('nowUtcIso');
        expect(res.body).toHaveProperty('epochMs');
      });

    // Checks whether the server time is returned within 100ms
    it('should return the current server time within 100ms', async () => {
        const start = Date.now();
        const response = await request(app).get('/server-time');
        const end = Date.now();
        expect(response.status).toBe(200);
        expect(end - start).toBeLessThan(100);
    });

    // Checks whether the server time returned is in the correct format
    it('should return the current server time in the correct format', async () => {
        const response = await request(app).get('/server-time');
        // const responseText = response.text;
        
        const { nowUtcIso, epochMs } = response.body;
        const parsedDate = new Date(nowUtcIso);

        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(typeof response.body.nowUtcIso).toBe('string');
        expect(typeof response.body.epochMs).toBe('number');
        expect(response.status).toBe(200);
        expect(parsedDate.toString()).not.toBe('Invalid Date');
        const timeDifference = Math.abs(parsedDate - new Date());
        expect(timeDifference).toBeLessThan(1000);
    });
});

afterAll(() => {
    server.close();
});
