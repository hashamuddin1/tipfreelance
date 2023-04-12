const express = require('express');
const userRouter = express.Router();
const { searchUser,sendOTPEmail,signupEmail,signinEmail,sendOTPPhone,signupPhone,signinPhone,updateUser,allUser,updateAvailible } = require('../controller/user')
const { verification } = require("../middleware/verifyEmailOTP");
const { verificationPhone } = require("../middleware/verifyPhoneOTP");
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
userRouter.post("/api/searchUser",verifyToken, searchUser);

userRouter.get("/api/allUser",verifyToken, allUser);
userRouter.put("/api/updateUser",upload.single('profilePicture'), updateUser);
userRouter.put("/api/updateAvailible",verifyToken, updateAvailible);

module.exports = userRouter