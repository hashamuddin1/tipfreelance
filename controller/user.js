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
const { ObjectId } = require('mongodb')

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

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      data: user,
      tag:"email",
      token
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
      tag:"email",
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
       to: `${req.body.phoneNumber}`
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

    const token = jwt.sign(
      { _id: user._id, phone_number: user.phone_number },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      data: user,
      tag:"phone",
      token
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
      tag:"phone",
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

const updateUser=async(req,res)=>{
  try{

    if(!req.body.email){
      return res.status(400).send({
        success: false,
        message: "Email Is Required",
      });
    }

    if(!req.body.countryCode){
      return res.status(400).send({
        success: false,
        message: "country Code Is Required",
      });
    }

    if(!req.body.phoneNumber){
      return res.status(400).send({
        success: false,
        message: "Phone Number Is Required",
      });
    }

    if(!req.body.firstName){
      return res.status(400).send({
        success: false,
        message: "First Name Is Required",
      });
    }

    if(!req.body.lastName){
      return res.status(400).send({
        success: false,
        message: "Last Name Is Required",
      });
    }

    if(!req.body.jobTitle){
      return res.status(400).send({
        success: false,
        message: "Job Title Is Required",
      });
    }

    if(!req.body.organization){
      return res.status(400).send({
        success: false,
        message: "Organization Is Required",
      });
    }

    if(!req.file){
      const updateProfile=await users.findByIdAndUpdate({_id:new ObjectId(req.query.id)},{
        first_name:req.body.firstName,
        last_name:req.body.lastName,
        email:req.body.email,
        country_code:req.body.countryCode,
        phone_number:req.body.phoneNumber,
        jobTitle:req.body.jobTitle,
        organization:req.body.organization,
        jobDescription:req.body.jobDescription,
        
      },{
        new:true
      })
  
      return res.status(200).send({
        success: true,
        message: "User Updated Successfully",
        data: updateProfile,
      });
    }

    if(req.file){

      const updateProfile=await users.findByIdAndUpdate({_id:new ObjectId(req.query.id)},{
        first_name:req.body.firstName,
        last_name:req.body.lastName,
        email:req.body.email,
        country_code:req.body.countryCode,
        phone_number:req.body.phoneNumber,
        jobTitle:req.body.jobTitle,
        organization:req.body.organization,
        jobDescription:req.body.jobDescription,
        profilePicture:"https://tippee.herokuapp.com/"+req.file.path
      },{
        new:true
      })
  
      return res.status(200).send({
        success: true,
        message: "User Updated Successfully",
        data: updateProfile,
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

const allUser=async(req,res)=>{
  try{
    const fetchUser=await users.find({_id:{$ne:new ObjectId(req.query.userId)},availible:true})
    return res.status(200).send({
      success: true,
      message: "All Users",
      data:fetchUser
    });
  }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

const updateAvailible=async(req,res)=>{
  try{

    const checkAvail=await users.findOne({_id:new ObjectId(req.query.id)})

    if(!checkAvail){
      return res.status(400).send({
        success: false,
        message: "User Not Found",
      });
    }

    if(checkAvail.availible===false){
      const updateAvail=await users.findByIdAndUpdate({_id:new ObjectId(req.query.id)},{
        availible:true
      },{
        new:true
      })

      return res.status(200).send({
        success: true,
        message: "User Availibility Updated to True",
      });
    }

    if(checkAvail.availible===true){
      const updateAvail=await users.findByIdAndUpdate({_id:new ObjectId(req.query.id)},{
        availible:false
      },{
        new:true
      })

      return res.status(200).send({
        success: true,
        message: "User Availibility Updated to False",
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

const searchUser=async(req,res)=>{
  try{

    const searching= await users.find({availible:true,first_name:{'$regex':new RegExp(req.body.first_name,"i")},_id:{$ne:new ObjectId(req.query.userId)}})

    return res.status(200).send({
      success: true,
      message: "Search Result",
      data:searching
    });

  }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = { 
  sendOTPEmail,
  signupEmail,
  signinEmail,
  sendOTPPhone,
  signupPhone,
  signinPhone,
  updateUser,
  allUser,
  updateAvailible ,
  searchUser
};
