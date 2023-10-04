const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialNotes)
})

describe('when there are initialy some blogs saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the proper id', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body.map(x => x.id)
    expect(id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a blog can be created', async () => {
    const body = {
      "name": "AutoTest",
      "title": "Auto Test",
      "url": "/auto_test.html",
      "upvotes": 6
    }

    await api
      .post('/api/blogs')
      .send(body)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.initialNotes.length + 1)
  })

  test('likes are zeroed', async () => {
    const body = {
      name: 'AutoTestZeroes',
      title: 'Auto Test Zeroes',
      url: '/auto_test_zeroes.html'
    }
    await api
      .post('/api/blogs')
      .send(body)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const getResponse = await api.get('/api/blogs')

    const upvotes = getResponse.body.map(r => r.upvotes)

    expect(upvotes).toContain(0)
  })

  test('title is present', async () => {
    const body = {
      name: 'Test missing title',
      url: '/missing_title.html',
      upvotes: 8
    }

    await api
      .post('/api/blogs')
      .send(body)
      .expect(400)
  })

  test('url is present', async () => {
    const body = {
      name: 'Test missing URL',
      url: '/missing_url.html',
      upvotes: 3
    }

    await api
      .post('/api/blogs')
      .send(body)
      .expect(400)
  })
})

describe('deletion of a node', () => {
  test('is successful', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.initialNotes.length - 1)
  })
})

afterAll(async () => await mongoose.connection.close())