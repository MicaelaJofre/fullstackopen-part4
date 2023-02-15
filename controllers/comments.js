const commentsRouter = require('express').Router({ mergeParams: true })
const Comment = require('../models/comments')
const Blog = require('../models/blogs')

commentsRouter.post('/', async (req, res) => {
    const blogId = req.params.blogId

    const comment = new Comment({ ...req.body, blog: blogId })
    const savedComment = await comment.save()
    await savedComment.populate('blog', { title: 1, author: 1 })

    const blog = await Blog.findById(blogId)
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()

    res.status(201).json(savedComment)
})


module.exports = commentsRouter