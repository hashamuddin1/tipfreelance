const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
    senderName: {
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
    type: {
        type: String,
        enum:["bank","card"]
    },
    amount: {
        type: Number,
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