const express = require('express');
const router = express.Router();
const { sendOTPEmail,signupEmail,signinEmail,sendOTPPhone,signupPhone,signinPhone } = require('../controller/user')
const { verification } = require("../middleware/verifyEmailOTP");
const { verificationPhone } = require("../middleware/verifyPhoneOTP");

router.post("/api/sendOTPinemail", sendOTPEmail);
router.post("/api/signupEmail",verification, signupEmail);
router.post("/api/signinEmail", signinEmail);

router.post("/api/sendOTPPhone",  sendOTPPhone);
router.post("/api/signupPhone",verificationPhone, signupPhone);
router.post("/api/signinPhone", signinPhone);

module.exports = router