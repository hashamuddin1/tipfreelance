const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true
    },
    last_name: {
        type: String,
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
    },
    jobTitle: {
        type: String,
    },
    jobDescription: {
        type: String,
    },
    organization: {
        type: String,
    },

})

//creating collection
const users = new mongoose.model('users', user_schema)


//export collection
module.exports = { users };