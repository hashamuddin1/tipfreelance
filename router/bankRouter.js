const express = require('express');
const bankRouter = express.Router();
const { insertBank,updateBank,getBankCard } = require('../controller/bank')
const verifyToken=require("../middleware/loginValidate")

bankRouter.post("/api/insertBank",verifyToken, insertBank);
bankRouter.put("/api/updateBank",verifyToken, updateBank);
bankRouter.get("/api/getBankCard",verifyToken, getBankCard);

module.exports = bankRouter