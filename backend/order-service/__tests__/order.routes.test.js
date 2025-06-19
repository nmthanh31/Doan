// ✅ Mock trước khi import controller và routes
jest.mock('../services/order.service');
const orderService = require('../services/order.service');
const orderRoutes = require('../routes/order.routes');

const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update quantity of item', async () => {
    const mockOrder = {
      message: 'update',
      item: {
        product_id: '200',
        quantity: 3,
      }
    };

    orderService.updateQuantity.mockReturnValue(mockOrder);

    const res = await request(app)
      .patch('/api/orders/item/update-quantity')
      .send({
        order_id: '1',
        product_id: '200',
        quantity: 2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('update');
    expect(res.body.item.quantity).toBe(3);
  });

  test('should delete item when quantity reduced to 0', async () => {
    const mockDelete = {
      message: 'delete',
    };

    orderService.updateQuantity.mockReturnValue(mockDelete);

    const res = await request(app)
      .patch('/api/orders/item/update-quantity')
      .send({
        order_id: '1',
        product_id: '200',
        quantity: -2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('delete');
  });
});
