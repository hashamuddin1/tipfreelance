const express = require('express');
const paymentRouter = express.Router();
const { getRecord,insertPayment,receivePayment } = require('../controller/payment')
const verifyToken=require("../middleware/loginValidate")

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:|\./g, '') + ' - ' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

paymentRouter.post("/api/insertPayment",[verifyToken,upload.single('gifImage'),], insertPayment);
paymentRouter.get("/api/getRecord",verifyToken, getRecord);
paymentRouter.post("/api/receivePayment",verifyToken, receivePayment);

module.exports = paymentRouter