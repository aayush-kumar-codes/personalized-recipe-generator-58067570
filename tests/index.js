import request from 'supertest';
import app from '../src/app'; // Adjust the path to your app
import mongoose from 'mongoose';

describe('API Tests', () => {
  beforeAll(async () => {
    const url = 'mongodb://localhost:27017/testdb'; // Use your test database URL
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 for GET /api/items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new item with POST /api/items', async () => {
    const newItem = { name: 'Test Item', description: 'This is a test item' };
    const response = await request(app).post('/api/items').send(newItem);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItem.name);
  });

  it('should return 404 for non-existing route', async () => {
    const response = await request(app).get('/api/non-existing-route');
    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid item creation', async () => {
    const invalidItem = { name: '' }; // Missing description
    const response = await request(app).post('/api/items').send(invalidItem);
    expect(response.status).toBe(400);
  });

  it('should update an existing item with PUT /api/items/:id', async () => {
    const itemToUpdate = await request(app).post('/api/items').send({ name: 'Update Item', description: 'To be updated' });
    const updatedItem = { name: 'Updated Item' };
    const response = await request(app).put(`/api/items/${itemToUpdate.body._id}`).send(updatedItem);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedItem.name);
  });

  it('should delete an item with DELETE /api/items/:id', async () => {
    const itemToDelete = await request(app).post('/api/items').send({ name: 'Delete Item', description: 'To be deleted' });
    const response = await request(app).delete(`/api/items/${itemToDelete.body._id}`);
    expect(response.status).toBe(204);
  });
});