const { users } = require("../model/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { Otp } = require("../model/emailOtp");
const { OtpPhone } = require("../model/phoneOTP");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendOTPEmail = async (req, res) => {
  try {
    const checkEmail=await users.findOne({email:req.body.email})
    if(checkEmail){
      return res.status(400).send({
        success: false,
        message: "This Email is already Exist",
      });
    }
    let otp_Code = Math.random().toString().substr(2, 6);
    let datetime = new Date().getTime() / 1000 + 300;
    let response = await new Otp({
      email: req.body.email,
      otp_Code: otp_Code,
      expireIn: datetime,
      is_verified: false,
    }).save();
    if (response) {
      const msg = {
        to: req.body.email,
        from: {
          name: "Tippee",
          email: process.env.SENDGRID_SENDER_EMAIL,
        },
        subject: "Sign Up OTP",
        templateId: process.env.SENDGRID_SENDOTP_TEMPLATE_ID,
        dynamicTemplateData: {
          OTP: otp_Code,
        },
      };
      sgMail.send(msg).then(() => {
        return res.status(200).send({
          success: true,
          message: "Email Sent Successfully",
        });
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const signupEmail = async (req, res) => {
  try {
    const checkEmail=await users.findOne({email:req.body.email})
    if(checkEmail){
      return res.status(400).send({
        success: false,
        message: "This Email is already Exist",
      });
    }
    const user = new users({
      email:req.body.email,
      password:req.body.password
    });
    let saltPassword = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(user.password, saltPassword);
    user.password = encryptedPassword;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      data: user,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const signinEmail=async(req,res)=>{
  try{

    if(!req.body.email){
       return res.status(400).send({
          success: false,
          message: "Email Is Required",
        });
    }

    if(!req.body.password){
      return res.status(400).send({
         success: false,
         message: "Password Is Required",
       });
   }

   const checkUser = await users.findOne({email:req.body.email});

   if(!checkUser){
    return res.status(400).send({
      success: false,
      message: "Invalid Email",
    });
   }

   if (checkUser && (await bcrypt.compare(req.body.password, checkUser.password))){
    const token = jwt.sign(
      { _id: checkUser._id, email: checkUser.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).send({
      success: true,
      message: "User Login Successfully",
      data: checkUser,
      token
    });

   }else {
    return res.status(400).send({
      success: false,
      message: "Invalid Credentials",
    });
     
    }

  }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

const sendOTPPhone=async(req,res)=>{
  try{

    const checkPhone=await users.findOne({phone_number:req.body.phoneNumber})
    
    if(checkPhone){
      return res.status(400).send({
        success: false,
        message: "This Phone Number is already Exist",
      });
    }
    let otp_Code = Math.random().toString().substr(2, 6);
    let datetime = new Date().getTime() / 1000 + 300;
    let response = await new OtpPhone({
      country_code:req.body.country_code,
      phone_number:req.body.phoneNumber,
      otp_Code: otp_Code,
      expireIn: datetime,
      is_verified: false,
    }).save();

    if (response) {
      const sendSms=await client.messages
    .create({
       body:  `Your OTP is ${otp_Code}`,
       from: `${process.env.TWILIO_PHONE_NUMBER}`,
       to: `${req.body.country_code}${req.body.phoneNumber}`
     })

     return res.status(200).send({
      success: true,
      message: `OTP sent to ${req.body.phoneNumber}`,
    });


    }
  }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

const signupPhone=async(req,res)=>{
  try{

    const checkPhone=await users.findOne({phone_number:req.body.phoneNumber})
    if(checkPhone){
      return res.status(400).send({
        success: false,
        message: "This Phone Number is already Exist",
      });
    }
    const user = new users({
      country_code:req.body.country_code,
      phone_number:req.body.phoneNumber,
      password:req.body.password
    });
    let saltPassword = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(user.password, saltPassword);
    user.password = encryptedPassword;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      data: user,
    });

  }catch(e){
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

const signinPhone=async(req,res)=>{
  try{

    if(!req.body.phoneNumber){
       return res.status(400).send({
          success: false,
          message: "Phone Number Is Required",
        });
    }

    if(!req.body.phoneNumber){
      return res.status(400).send({
         success: false,
         message: "Phone Number Is Required",
       });
   }

    if(!req.body.password){
      return res.status(400).send({
         success: false,
         message: "Password Is Required",
       });
   }

   const checkUser = await users.findOne({phone_number:req.body.phoneNumber});

   if(!checkUser){
    return res.status(400).send({
      success: false,
      message: "Invalid Phone Number",
    });
   }

   if (checkUser && (await bcrypt.compare(req.body.password, checkUser.password))){
    const token = jwt.sign(
      { _id: checkUser._id, phone_number: checkUser.phone_number },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).send({
      success: true,
      message: "User Login Successfully",
      data: checkUser,
      token
    });

   }else {
    return res.status(400).send({
      success: false,
      message: "Invalid Credentials",
    });
     
    }

  }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = { sendOTPEmail, signupEmail,signinEmail,sendOTPPhone,signupPhone,signinPhone };
