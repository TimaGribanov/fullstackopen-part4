const Blog = require('../models/blog')
const blogRouter = require('express').Router()
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const foundBlog = await Blog.findById(id)
  response.json(foundBlog)
})

blogRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user

  const newBlog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    upvotes: body.upvotes,
    user: user._id
  })

  try {
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const upvotes = request.body.upvotes

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { upvotes },
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})

blogRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const id = request.params.id
  const user = request.user

  const blogToDelete = await Blog.findById(id)

  if (blogToDelete.user.toString() === user._id.toString()) {
    try {
      await Blog.findByIdAndRemove(blogToDelete.id)
      response.status(204).end()
    } catch (e) {
      next(e)
    }
  } else {
    return response.status(403).json({ error: 'access is forbidden' })
  }
})

module.exports = blogRouter