// test/horses.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './test-util';

describe('Horses', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/horses', () => {
    it('should return 403 if user role is vet', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'vet')
        .send({
          name: 'Spirit',
          age: 5,
          breed: 'Arabian',
          healthStatus: 'Healthy',
          owner: 'owner123',
        });

      // Assert
      expect(response.status).toBe(403);
    });

    it('should create a horse if user role is admin', async () => {
      // Arrange
      const ownerResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });
      const ownerId = ownerResponse.body.id;

      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Spirit',
          age: 5,
          breed: 'Arabian',
          healthStatus: 'Healthy',
          owner: ownerId,
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'Spirit',
        age: 5,
        breed: 'Arabian',
        healthStatus: 'Healthy',
        owner: ownerId,
        createdAt: expect.any(String),
      });
    });

    it('should return 404 if owner does not exist', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Spirit',
          age: 5,
          breed: 'Arabian',
          healthStatus: 'Healthy',
          owner: 'non-existing-owner',
        });

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('GET /v1/horses', () => {
    it('should allow admin to get horses', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/v1/horses')
        .set('x-user-role', 'admin');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow vet to get horses and filter by query params', async () => {
      // Arrange
      const ownerResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });
      const ownerId = ownerResponse.body.id;

      const arabianHorse = {
        name: 'Spirit',
        age: 5,
        breed: 'Arabian',
        healthStatus: 'Healthy',
        owner: ownerId,
      };
      await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send(arabianHorse);

      const tigerHorse = {
        name: 'Tiger King',
        age: 7,
        breed: 'Tiger Horse',
        healthStatus: 'Healthy',
        owner: ownerId,
      };
      await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send(tigerHorse);

      // Act
      const response = await request(app.getHttpServer())
        .get('/v1/horses')
        .set('x-user-role', 'vet')
        .query({ breed: 'Tiger Horse' });

      // Assert
      expect(response.status).toBe(200);

      expect(response.body).toContainEqual({
        ...tigerHorse,
        id: expect.any(String),
        createdAt: expect.any(String),
      });
      expect(response.body).not.toContainEqual({
        ...arabianHorse,
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });

  describe('PUT /v1/horses/:id', () => {
    it('should update a horse if user role is admin', async () => {
      // Arrange
      const ownerResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });
      const ownerId = ownerResponse.body.id;

      const createResponse = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Thunder',
          age: 7,
          breed: 'Thoroughbred',
          healthStatus: 'Healthy',
          owner: ownerId,
        });
      const horseId = createResponse.body.id;
      const updateBody = { breed: 'Quarter Horse' };

      // Act
      const updateResponse = await request(app.getHttpServer())
        .put(`/v1/horses/${horseId}`)
        .set('x-user-role', 'admin')
        .send(updateBody);

      // Assert
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.breed).toBe('Quarter Horse');
    });

    it('should return 403 if user role is vet', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Thunder',
          age: 7,
          breed: 'Thoroughbred',
          healthStatus: 'Healthy',
          owner: 'owner123',
        });
      const horseId = createResponse.body.id;
      const updateBody = { breed: 'Quarter Horse' };

      // Act
      const updateResponse = await request(app.getHttpServer())
        .put(`/v1/horses/${horseId}`)
        .set('x-user-role', 'vet')
        .send(updateBody);

      // Assert
      expect(updateResponse.status).toBe(403);
    });
  });

  describe('PATCH /v1/horses/:id/health', () => {
    it('should update healthStatus if user role is vet', async () => {
      // Arrange
      const ownerResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });
      const ownerId = ownerResponse.body.id;

      const createResponse = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Storm',
          age: 6,
          breed: 'Mustang',
          healthStatus: 'Healthy',
          owner: ownerId,
        });
      const horseId = createResponse.body.id;
      const updateBody = { healthStatus: 'Injured' };

      // Act
      const patchResponse = await request(app.getHttpServer())
        .patch(`/v1/horses/${horseId}/health`)
        .set('x-user-role', 'vet')
        .send(updateBody);

      // Assert
      expect(patchResponse.status).toBe(200);
      expect(patchResponse.body.healthStatus).toBe('Injured');
    });

    it('should return 400 if trying to update something else than healthStatus', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Storm',
          age: 6,
          breed: 'Mustang',
          healthStatus: 'Healthy',
          owner: 'owner123',
        });
      const horseId = createResponse.body.id;
      const updateBody = { healthStatus: 'Injured', breed: 'Quarter Horse' };

      // Act
      const patchResponse = await request(app.getHttpServer())
        .patch(`/v1/horses/${horseId}/health`)
        .set('x-user-role', 'vet')
        .send(updateBody);

      // Assert
      expect(patchResponse.status).toBe(400);
      expect(patchResponse.body.message).toStrictEqual([
        'property breed should not exist',
      ]);
    });
  });

  describe('DELETE /v1/horses/:id', () => {
    it('should delete a horse if user role is admin', async () => {
      // Arrange
      const ownerResponse = await request(app.getHttpServer())
        .post('/v1/owners')
        .set('x-user-role', 'admin')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });
      const ownerId = ownerResponse.body.id;

      const createResponse = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Blaze',
          age: 4,
          breed: 'Friesian',
          healthStatus: 'Healthy',
          owner: ownerId,
        });
      const horseId = createResponse.body.id;

      // Act
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/v1/horses/${horseId}`)
        .set('x-user-role', 'admin');

      // Assert
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app.getHttpServer())
        .get(`/v1/horses/${horseId}`)
        .set('x-user-role', 'admin');

      expect(getResponse.status).toBe(404);
    });

    it('should return 403 if user role is vet', async () => {
      // Arrange
      const createResponse = await request(app.getHttpServer())
        .post('/v1/horses')
        .set('x-user-role', 'admin')
        .send({
          name: 'Blaze',
          age: 4,
          breed: 'Friesian',
          healthStatus: 'Healthy',
          owner: 'owner123',
        });
      const horseId = createResponse.body.id;

      // Act
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/v1/horses/${horseId}`)
        .set('x-user-role', 'vet');

      // Assert
      expect(deleteResponse.status).toBe(403);
    });
  });
});
