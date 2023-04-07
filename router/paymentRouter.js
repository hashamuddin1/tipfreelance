const express = require('express');
const paymentRouter = express.Router();
const { getRecord,insertPayment } = require('../controller/payment')
const verifyToken=require("../middleware/loginValidate")

paymentRouter.post("/api/insertPayment",verifyToken, insertPayment);
paymentRouter.get("/api/getRecord",verifyToken, getRecord);

module.exports = paymentRouter