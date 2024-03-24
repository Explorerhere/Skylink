// __tests__/login.test.js
require('dotenv').config({ path: './.env.test' });

const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
const mongoose = require('mongoose');

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Disconnect after tests
  await mongoose.connection.close();
});

describe("User Login", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "password",
      });
    expect(res.statusCode).toEqual(201);
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "test@example.com",
        password: "password",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });
});
