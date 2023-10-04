const { Int32 } = require('bson')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  author: String,
  title: { type: String, required: true },
  url: { type: String, required: true },
  upvotes: { type: Number, default: 0 }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)