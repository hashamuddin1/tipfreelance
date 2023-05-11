const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required:true
    },
     receiverName: {
        type: String,
        required:true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref:"users"
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref:"users"
    },
    senderProfilePic: {
        type: String,
    },
    receiverProfilePic: {
        type: String,
    },
    senderJobTitle: {
        type: String,
    },
    receiverJobTitle: {
        type: String,
    },
    type: {
        type: String,
        enum:["bank","card"]
    },
    amount: {
        type: Number,
        required:true
    },
    isReceive: {
        type: Boolean,
        default:false
    },
    gifImage: {
        type: String,
        default:null
    },
    note: {
        type: String,
        default:null
    },
    date: {
        type: Date,
        required:true
    },
},{
    timestamps: true
});

const Payment = new mongoose.model('payments', PaymentSchema)

module.exports = { Payment };