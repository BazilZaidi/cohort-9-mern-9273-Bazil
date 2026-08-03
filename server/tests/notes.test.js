const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../server');
const User = require('../models/User');
const Note = require('../models/Note');

describe('Notes API', () => {
  const testUser = {
    name: 'Notes Test User',
    email: 'notestest@example.com',
    password: 'password123',
  };

  let token;
  let noteId;

  before(async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser);
    token = res.body.token;
  });

  after(async () => {
    await Note.deleteMany({});
    await User.deleteOne({ email: testUser.email });
    // await mongoose.connection.close();
  });

  describe('POST /api/notes', () => {
    it('should create a note when authenticated', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Note', content: 'Some content' });

      expect(res.status).to.equal(201);
      expect(res.body.title).to.equal('Test Note');
      expect(res.body.user).to.exist;

      noteId = res.body._id;
    });

    it('should reject creating a note without a token', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({ title: 'No Auth Note' });

      expect(res.status).to.equal(401);
    });

    it('should reject a note with no title', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Missing title' });

      expect(res.status).to.equal(400);
    });
  });

  describe('GET /api/notes', () => {
    it('should get all notes for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should get a single note by id', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(noteId);
    });

    it('should return 404 for a non-existent note', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Title' });

      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Updated Title');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Note deleted successfully');
    });

    it('should return 404 when getting the deleted note', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });
  });
});