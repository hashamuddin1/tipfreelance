const { Bank } = require("../model/bank");
const { Card } = require("../model/card");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.Secret_Key);


const insertBank = async (req, res) => {
  try {
    if (!req.body.bankName) {
      return res.status(400).send({
        success: false,
        message: "Bank Name Is Required",
      });
    }

    if (!req.body.accountNumber) {
      return res.status(400).send({
        success: false,
        message: "Account Number Is Required",
      });
    }

    if (!req.query.userId) {
      return res.status(400).send({
        success: false,
        message: "User ID Is Required",
      });
    }

    const account = await stripe.accounts.create({
      type: 'custom',
      country: req.body.country,
      email: "abc@gmail.com",
      capabilities: {
        transfers: { requested: true },
      },
      business_profile: {
        mcc: req.body.mcc,
        name: "demo",
        support_email: "abc@gmail.com",
    
        support_url: "https://bestcookieco.com",
        url: "https://bestcookieco.com",
        support_address: {
          city: "abc",
          line1: "abc",
          line2: "abc",
          postal_code: req.body.Postal_code

        }
      },
      business_type:"individual",
      company: {
        name: "jemex",
        phone: "3365214895",
        address: {
          city: "abc",
          line1: "abc",
          line2:"abc",
          postal_code: req.body.Postal_code
        }
      },
      individual: {
        address: {
          city: "abc",
          line1: "abc",
          line2: "abc",
          postal_code: req.body.Postal_code
        },

        dob: {
          day: "5",
          month: "5",
          year: "1980",
        },
        email: "abc@gmail.com",
        first_name: "abc",
        last_name: "abc",
        maiden_name: "abc",
        phone: "3369857402",
        registered_address: {
          city: "abc",
          line1: "abc",
          line2: "abc",
          postal_code: req.body.Postal_code
        },
       
      },
      external_account: {
        account_number: req.body.accountNumber,
        object: "bank_account",
        country: req.body.country,
       currency: req.body.currency,
       //routing_number:"110000000"
      
      },
     
      tos_acceptance: { service_agreement: 'recipient',date: 1609798905, ip: '8.8.8.8' }
    });

    const cardBank = new Bank({
      bankName: req.body.bankName,
      accountNumber: req.body.accountNumber,
      userId: req.query.userId,
      accountId:account.id
    });

    await cardBank.save();

    return res.status(200).send({
      success: true,
      message: "Bank Account Inserted Successfully",
      data: cardBank,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateBank=async(req,res)=>{
    try{

        const updatedBank=await Bank.findByIdAndUpdate({_id:new ObjectId(req.query.bankId)},{
            bankName:req.body.bankName,
            accountNumber:req.body.accountNumber,
          },{
            new:true
          })
      
          return res.status(200).send({
            success: true,
            message: "Bank Account Updated Successfully",
            data: updatedBank,
          });

    }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

const getBankCard=async(req,res)=>{
    try{
        const bankDetail=await Bank.find({userId:new ObjectId(req.query.userId)});
        const cardDetail=await Card.find({userId:new ObjectId(req.query.userId)});

        return res.status(200).send({
            success: true,
            message: "Bank And Card Detail",
            BankData: bankDetail,
            CardData: cardDetail,
          });
    }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = { insertBank,updateBank,getBankCard };
