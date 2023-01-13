const listHelper = require('../utils/list_helper')
const blogs = require('./blogs.js')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})


describe('total likes', () => {

    test('the sum of the likes of the array', () => {
        expect(listHelper.totalLikes(blogs)).toBe(60)
    })
    test('of empty array is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
})
describe('favorite Blog', () => {
    test('the blog with the most likes', () => {
        expect(listHelper.favoriteBlog(blogs)).toEqual({
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 20,
            __v: 0
        })
    })
})