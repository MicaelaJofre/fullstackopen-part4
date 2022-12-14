const dummy = (blogs) => {
    blogs
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.filter(blog => blog.likes === Math.max(...blogs.map(blog => blog.likes)))[0]
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}