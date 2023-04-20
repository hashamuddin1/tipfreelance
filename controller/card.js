const { Card } = require("../model/card");
require("dotenv").config();
const { ObjectId } = require('mongodb')

const insertCard = async (req, res) => {
  try {
    if (!req.body.cardName) {
      return res.status(400).send({
        success: false,
        message: "Card Name Is Required",
      });
    }

    if (!req.body.cardNumber) {
      return res.status(400).send({
        success: false,
        message: "Card Number Is Required",
      });
    }

    if (!req.body.expMonth) {
      return res.status(400).send({
        success: false,
        message: "Expiry Month Is Required",
      });
    }

    if (!req.body.expYear) {
      return res.status(400).send({
        success: false,
        message: "Expiry Year Is Required",
      });
    }

    if (!req.body.cvv) {
      return res.status(400).send({
        success: false,
        message: "Cvv Is Required",
      });
    }

    if (!req.query.userId) {
      return res.status(400).send({
        success: false,
        message: "User ID Is Required",
      });
    }

    

    const cardInsert = new Card({
      cardName: req.body.cardName,
      cardNumber: req.body.cardNumber,
      expMonth: req.body.expMonth,
      expYear: req.body.expYear,
      cvv: req.body.cvv,
      userId: req.query.userId,
    });

    await cardInsert.save();

    return res.status(200).send({
      success: true,
      message: "Card Inserted Successfully",
      data: cardInsert,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateCard=async(req,res)=>{
    try{

        const updatedCard=await Card.findByIdAndUpdate({_id:new ObjectId(req.query.cardId)},{
            cardName:req.body.cardName,
            cardNumber:req.body.cardNumber,
            expMonth:req.body.expMonth,
            expYear:req.body.expYear,
            cvv:req.body.cvv,
          },{
            new:true
          })
      
          return res.status(200).send({
            success: true,
            message: "Card Updated Successfully",
            data: updatedCard,
          });

    }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = { insertCard,updateCard };
