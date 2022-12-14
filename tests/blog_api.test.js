const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const api = supertest(app)
const { initialBlogs, blogsInDb } = require('./test_helper')


beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blog are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})



/* test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
})

test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe('React patterns')
}) */

describe('when there is initially some blogs saved', () => {
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.title)
        expect(contents).toContain('React patterns')
    })

    test('returned blog has and id key', async () => {
        const blogAtEnd = await blogsInDb()
        const contents = blogAtEnd.map(r => r.id)
        expect(contents).toBeDefined()
    })

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })

})

describe('when we want to save new blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Jupiter',
            author: 'Morales Gaston',
            url: 'https://Jupiter.com/',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        const blogAtEnd = await blogsInDb()
        expect(blogAtEnd).toHaveLength(initialBlogs.length + 1)

        const contents = blogAtEnd.map(r => r.title)
        expect(contents).toContain('Jupiter')
    })

    test('blog without content is not added', async () => {
        const newBlog = {
            likes: 4,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogAtEnd = await blogsInDb()

        expect(blogAtEnd).toHaveLength(initialBlogs.length)
    })

    test('missing property likes', async () => {
        const newBlog = {
            title: 'Mercurio',
            author: 'Alejandra Chacon',
            url: 'https://Mercurio.com/'
        }

        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        expect(result.body.likes).toBe(0)
    })
})

describe('when we want to delete blogs', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

        const contents = blogsAtEnd.map(r => r.title)

        expect(contents).not.toContain(blogToDelete.title)
    })
})




afterAll(() => {
    mongoose.connection.close()
})