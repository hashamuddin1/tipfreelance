const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
    senderName: {
        type: String,
    },
     receiverName: {
        type: String,
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
    },
    isReceive: {
        type: Boolean,
        default:false
    },
    gifImage: {
        type: String,
    },
    note: {
        type: String,
    },
    date: {
        type: Date,
        default:Date.now
    },
},{
    timestamps: true
});

const Payment = new mongoose.model('payments', PaymentSchema)

module.exports = { Payment };