const blogsRouter = require('express').Router()
const tokenExtractor = require('../utils/middleware').tokenExtractor

const Blog = require('../models/blogs')
const User = require('../models/users')
const Comment = require('../models/comments')




blogsRouter.get('/', async (request, response) => {
    const blog = await Blog.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 })
    response.json(blog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 })
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', tokenExtractor, async (request, response) => {
    const body = request.body
    const userId = request.userId

    const user = await User.findById(userId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const savedBlog = await blog.save()
    await savedBlog.populate('user', { username: 1, name: 1 })
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})

blogsRouter.put('/:id', tokenExtractor, async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes || 0
    }

    const blogToUpdate = await Blog.findById(request.params.id)
    if (!blogToUpdate) {
        res.status(404).json({ message: 'blog not found' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 })
    response.json(updatedBlog)

})


blogsRouter.delete('/:id', tokenExtractor, async (request, response) => {
    const foundBlog = await Blog.findById(request.params.id)
    if (!foundBlog) return response.status(204).end()

    if (foundBlog.user.toString() !== request.userId) return response.status(401).end()

    await Blog.findByIdAndRemove(request.params.id).populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 })
    response.status(204).end()
})




module.exports = blogsRouter