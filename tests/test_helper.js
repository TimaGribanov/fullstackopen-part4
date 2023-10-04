const Blog = require('../models/blog')

const initialNotes = [
  {
    name: 'First',
    title: 'Test Test',
    url: '/test1.html',
    upvotes: 4
  },
  {
    name: 'Second',
    title: 'Test Test',
    url: '/test2.html',
    upvotes: 5
  },
  {
    name: 'Third',
    title: 'Test Test',
    url: '/test3.html',
    upvotes: 1
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialNotes,
  blogsInDb
}