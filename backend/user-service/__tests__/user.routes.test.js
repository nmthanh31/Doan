const request = require('supertest');
const express = require('express');

// Mock service
jest.mock('../services/user.service');
const userService = require('../services/user.service');
const userRoutes = require('../routes/user.routes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mock sau mỗi test
  });

  describe('POST /register', () => {
    it('should return 201 Created when registration is successful', async () => {
      const userData = {
        full_name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        address: '123 Test St',
      };

      userService.findUserByEmail.mockReturnValue(undefined); // Email chưa tồn tại
      userService.countUsers.mockReturnValue(0); // Số lượng user hiện tại
      userService.createUser.mockImplementation(() => {}); // không cần return gì cả

      const res = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(userService.findUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.createUser).toHaveBeenCalled();
    });

    it('should return 400 Bad Request if email already exists', async () => {
      const userData = {
        full_name: 'Existing User',
        email: 'exist@example.com',
        password: 'password123',
        phone: '0987654321',
        address: '456 Test St',
      };

      userService.findUserByEmail.mockReturnValue({ id: 1, ...userData }); // Email đã tồn tại

      const res = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email already exists');
      expect(userService.findUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });
});
