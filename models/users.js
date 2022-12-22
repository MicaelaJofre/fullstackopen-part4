const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // el passwordHash no debe ser revelado
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User