import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './test-util';

describe('Owners', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/owners', () => {
    it('should return 403 if user role is vet', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'vet')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      // Assert
      expect(response.status).toBe(403);
    });

    it('should create an owner if user role is admin', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: expect.any(String),
      });

      const getResponse = await request(app.getHttpServer())
        .get(`/v1/owners/${response.body.id}`)
        .set('x-user-role', 'admin');
      expect(getResponse.body).toEqual(response.body);
    });
  });

  describe('GET /v1/owners/:id', () => {
    it('should allow vet to get an owner by ID', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
        });
      const ownerId = createResponse.body.id;

      // Act
      const getResponse = await request(app.getHttpServer())
        .get(`/v1/owners/${ownerId}`)
        .set('x-user-role', 'vet');

      // Assert
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toMatchObject({
        id: ownerId,
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
    });
  });

  describe('GET /v1/owners', () => {
    it('should allow admin to list all owners', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/v1/owners')
        .set('x-user-role', 'admin');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /v1/owners/:id', () => {
    it('should update owner if user role is admin', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'Bob Dylan',
          email: 'bob@example.com',
        });
      const ownerId = createResponse.body.id;

      // Act
      const updateResponse = await request(app.getHttpServer())
        .put(`/v1/owners/${ownerId}`)
        .set('x-user-role', 'admin')
        .send({ name: 'Bob D.' });

      // Assert
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.name).toBe('Bob D.');

      const getResponse = await request(app.getHttpServer())
        .get(`/v1/owners/${ownerId}`)
        .set('x-user-role', 'admin');
      expect(getResponse.body.name).toBe('Bob D.');
    });

    it('should return 403 if user role is vet', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'Bob Dylan',
          email: 'bob@example.com',
        });
      const ownerId = createResponse.body.id;

      // Act
      const updateResponse = await request(app.getHttpServer())
        .put(`/v1/owners/${ownerId}`)
        .set('x-user-role', 'vet')
        .send({ name: 'Bob D.' });

      // Assert
      expect(updateResponse.status).toBe(403);
    });
  });

  describe('DELETE /v1/owners/:id', () => {
    it('should delete owner if user role is admin', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'Alice Cooper',
          email: 'alice@example.com',
        });
      const ownerId = createResponse.body.id;

      // Act
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/v1/owners/${ownerId}`)
        .set('x-user-role', 'admin');

      // Assert
      expect(deleteResponse.status).toBe(204);

      // Also assert that the owner no longer exists
      const getResponse = await request(app.getHttpServer())
        .get(`/v1/owners/${ownerId}`)
        .set('x-user-role', 'admin');
      expect(getResponse.status).toBe(404);
    });

    it('should return 403 if user role is vet', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'Alice Cooper',
          email: 'alice@example.com',
        });
      const ownerId = createResponse.body.id;

      // Act
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/v1/owners/${ownerId}`)
        .set('x-user-role', 'vet');

      // Assert
      expect(deleteResponse.status).toBe(403);
    });
  });
});
