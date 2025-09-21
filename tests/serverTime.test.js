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
describe('GET /serverTime', () => {
    it('should return the current server time', async () => {
        const response = await request(app).get('/serverTime');
        console.log(response.text); // logging to check
        expect(response.status).toBe(200);
        expect(response.text).toMatch("Current server time is");
    });

    // Checks whether the server time is returned within 100ms
    it('should return the current server time within 100ms', async () => {
        const start = Date.now();
        const response = await request(app).get('/serverTime');
        const end = Date.now();
        expect(response.status).toBe(200);
        expect(end - start).toBeLessThan(100);
    });

    // Checks whether the server time returned is in the correct format
    it('should return the current server time in the correct format', async () => {
        const response = await request(app).get('/serverTime');
        const responseText = response.text;
        
        const responseTime = responseText.replace("Current server time is ", "");
        const parsedDate = new Date(responseTime);

        expect(response.status).toBe(200);
        expect(parsedDate.toString()).not.toBe('Invalid Date');
        const timeDifference = Math.abs(parsedDate - new Date());
        expect(timeDifference).toBeLessThan(1000);
    });
});

afterAll(() => {
    server.close();
});
