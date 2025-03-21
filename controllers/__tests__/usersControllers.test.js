const request = require('supertest');
const { describe, test, expect, beforeAll, afterAll } = require("@jest/globals");

const app = require('../../app');
const db = require('../../db');
const User = require('../../models/schemas/userSchema')

describe('Login user', () => {
    beforeAll(() => db.connect(process.env.DB_HOST));

    test("create user", async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@example.com',
            password: 'password123',
          });

          expect(res.status).toBe(201);
          expect(res.body.user).toEqual({
            email: 'test@example.com',
            subscription: 'starter',
          });
    });

    test("login user", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: 'test@example.com',
            password: 'password123',
        });
        expect(res.status).toBe(200);
        expect(res.body.user).toEqual({
          email: 'test@example.com',
          subscription: 'starter',
        });
        expect(res.body.token).toBeDefined();
      });

    afterAll(async () => {
      await User.deleteMany({});
      await db.disconnect();
    });
  });
  
