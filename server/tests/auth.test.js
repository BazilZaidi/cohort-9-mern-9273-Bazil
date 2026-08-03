const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: 'mochatest@example.com',
    password: 'password123',
  };

  after(async () => {
    await User.deleteOne({ email: testUser.email });
    // await mongoose.connection.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return a token', async () => {
      const res = await request(app).post('/api/auth/signup').send(testUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('token');
      expect(res.body.user.email).to.equal(testUser.email);
    });

    it('should not allow duplicate email signup', async () => {
      const res = await request(app).post('/api/auth/signup').send(testUser);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should reject wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Invalid credentials');
    });
  });
});