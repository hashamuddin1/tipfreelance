const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        required:true
    },
    cardNumber: {
        type: String,
        required:true
    },
    expMonth: {
        type: String,
        required:true
    },
    expYear: {
        type: String,
        required:true
    },
    cvv: {
        type: String,
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref:"users"
    },
},{
    timestamps: true
});

const Card = new mongoose.model('cards', CardSchema)

module.exports = { Card };