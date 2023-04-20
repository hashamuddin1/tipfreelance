const express = require('express');
const paymentRouter = express.Router();
const { getRecord,insertPayment,receivePayment } = require('../controller/payment')
const verifyToken=require("../middleware/loginValidate")

paymentRouter.post("/api/insertPayment",verifyToken, insertPayment);
paymentRouter.get("/api/getRecord",verifyToken, getRecord);
paymentRouter.post("/api/receivePayment",verifyToken, receivePayment);

module.exports = paymentRouter