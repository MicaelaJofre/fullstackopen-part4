const blogsRouter = require('express').Router()
const tokenExtractor = require('../utils/middleware').tokenExtractor

const Blog = require('../models/blogs')
const User = require('../models/users')




blogsRouter.get('/', async (request, response) => {
    const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
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
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})

blogsRouter.delete('/:id', tokenExtractor, async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})



module.exports = blogsRouter