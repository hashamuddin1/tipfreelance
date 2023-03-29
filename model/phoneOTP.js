const mongoose = require("mongoose");

const OtpSchemaPhone = new mongoose.Schema({
    country_code:{
        type: String,
        required:true
    },
    phone_number: {
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

//creating collection
const OtpPhone = new mongoose.model('otpPhone', OtpSchemaPhone)

//export collection
module.exports = { OtpPhone };