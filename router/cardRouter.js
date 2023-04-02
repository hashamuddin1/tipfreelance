const express = require('express');
const cardRouter = express.Router();
const { insertCard,updateCard } = require('../controller/card')
const verifyToken=require("../middleware/loginValidate")

cardRouter.post("/api/insertCard",verifyToken, insertCard);
cardRouter.put("/api/updateCard",verifyToken, updateCard);

module.exports = cardRouter