const express = require('express');
const userRouter = express.Router();
const { sendOTPEmail,signupEmail,signinEmail,sendOTPPhone,signupPhone,signinPhone,updateUser } = require('../controller/user')
const { verification } = require("../middleware/verifyEmailOTP");
const { verificationPhone } = require("../middleware/verifyPhoneOTP");

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
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

userRouter.post("/api/sendOTPinemail", sendOTPEmail);
userRouter.post("/api/signupEmail",verification, signupEmail);
userRouter.post("/api/signinEmail", signinEmail);

userRouter.post("/api/sendOTPPhone",  sendOTPPhone);
userRouter.post("/api/signupPhone",verificationPhone, signupPhone);
userRouter.post("/api/signinPhone", signinPhone);

userRouter.put("/api/updateUser",upload.single('profilePicture'), updateUser);

module.exports = userRouter