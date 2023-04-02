const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BankSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required:true
    },
    accountNumber: {
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

const Bank = new mongoose.model('banks', BankSchema)

module.exports = { Bank };