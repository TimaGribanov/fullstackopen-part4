const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const foundBlog = await Blog.findById(id)
  response.json(foundBlog)
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => {
      response.status(400).json(error)
    })
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

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  try {
    await Blog.findByIdAndRemove(id)
  } catch (e) {
    console.log(e)
  }

  response.status(204).end()
})

module.exports = blogRouter