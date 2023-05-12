const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvailiblePaymentSchema = new mongoose.Schema({
    receiverId: {
        type: Schema.Types.ObjectId,
        ref:"users"
    },
    amount: {
        type: Number,
        required:true
    },
},{
    timestamps: true
});

const AvailiblePayment = new mongoose.model('availiblePayment', AvailiblePaymentSchema)

module.exports = { AvailiblePayment };