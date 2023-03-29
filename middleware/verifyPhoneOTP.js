const { OtpPhone } = require("../model/phoneOTP");

verificationPhone = async(req, res, next) => {
    try {
        var date = new Date().getTime() / 1000;
        let data = await OtpPhone.findOne({
            country_code:req.body.country_code,
            phone_number:req.body.phoneNumber,
            is_verified: false,
            otp_Code: req.body.otp_Code,
            expireIn: { $gte: date }
        })
  
        if (data) {
             await OtpPhone.updateOne({
                _id: data._id
            }, {
                is_verified: true
            })
           
        } 
        else {
            return res.status(400).send({
                success:false,
                message:"OTP not Verified"
            })
        }
        next()
    } catch (error) {
        console.trace("Inside Catch => ", error);
        return res.status(500).send({
            success:false,
            message:"Some Error Is Occurred"
        })
    }

}
const verify = {
    verificationPhone,
};

module.exports = verify;