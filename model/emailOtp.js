const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    otp_Code: {
        type: String,
        required:true
    },
    expireIn: {
        type: Number
    },
    is_verified: {
        type: Boolean,
        default:false
    },
},{
    timestamps: true
});

const Otp = new mongoose.model('otp', OtpSchema)

module.exports = { Otp };