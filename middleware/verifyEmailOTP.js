const { Otp } = require("../model/emailOtp");

verification = async(req, res, next) => {
    try {
        var date = new Date().getTime() / 1000;
        let data = await Otp.findOne({
            email: req.body.email,
            is_verified: false,
            otp_Code: req.body.otp_Code,
            expireIn: { $gte: date }
        })
        if (data) {
             await Otp.updateOne({
                _id: data._id
            }, {
                is_verified: true
            })
           
        } 
        else {
            res.status(400).send({
                success:false,
                message:"OTP not Verified"
            })
        }
        next()
    } catch (error) {
        console.trace("Inside Catch => ", error);
        res.status(500).send({
            success:false,
            message:"Some Error Is Occurred"
        })
    }

}
const verify = {
    verification,
};

module.exports = verify;