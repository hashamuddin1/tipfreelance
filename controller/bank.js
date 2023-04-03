const { Bank } = require("../model/bank");
const { Card } = require("../model/card");
require("dotenv").config();
const { ObjectId } = require("mongodb");

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

    const cardBank = new Bank({
      bankName: req.body.bankName,
      accountNumber: req.body.accountNumber,
      userId: req.query.userId,
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
