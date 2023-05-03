const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new mongoose.Schema({
    first_name: {
        type: String,
        default: null,
        trim: true
    },
    last_name: {
        type: String,
        default: null,
        trim: true
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    country_code:{
        type: String,
        trim: true,
    },
    phone_number: {
        type: String,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    jobTitle: {
        type: String,
        default: null,
    },
    jobDescription: {
        type: String,
        default: null,
    },
    organization: {
        type: String,
        default: null,
    },
    availible:{
        type:Boolean,
        default: false
    }

})

//creating collection
const users = new mongoose.model('users', user_schema)


//export collection
module.exports = { users };