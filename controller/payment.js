const { Payment } = require("../model/payment");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const { users } = require("../model/user");
const stripe = require("stripe")(process.env.Secret_Key);

const getRecord = async (req, res) => {
  try {
    if (req.query.senderId) {
      let totalPayment = 0;
      const fetchPayment = await Payment.find({
        senderId: new ObjectId(req.query.senderId),
      });
      for (i = 0; i < fetchPayment.length; i++) {
        totalPayment += fetchPayment[i].amount;
      }
      return res.status(200).send({
        success: true,
        message: "All Payment Record",
        TotalPayment: totalPayment,
        data: fetchPayment,
      });
    }

    if (req.query.receiverId) {
      let totalPayment = 0;
      const fetchPayment = await Payment.find({
        receiverId: new ObjectId(req.query.receiverId),
        isReceive: false,
      });
      for (i = 0; i < fetchPayment.length; i++) {
        totalPayment += fetchPayment[i].amount;
      }
      return res.status(200).send({
        success: true,
        message: "All Payment Record",
        TotalPayment: totalPayment,
        data: fetchPayment,
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

const insertPayment = async (req, res) => {
  try {
    const senderData = await users.findOne({
      _id: new ObjectId(req.body.senderId),
    });
    if (!senderData) {
      return res.status(400).send({
        success: false,
        message: "Sender User Not Found",
      });
    }

    const receiverData = await users.findOne({
      _id: new ObjectId(req.body.receiverId),
    });
    if (!receiverData) {
      return res.status(400).send({
        success: false,
        message: "Receiver User Not Found",
      });
    }

    const customer = await stripe.customers.create();

    console.log(customer.id)

    const param = {};
    param.card = {
      number: req.body.cardNumber,
      exp_month: req.body.expMonth,
      exp_year: req.body.expYear,
      cvc: req.body.cvc,
    };

    stripe.tokens.create(param, function (err, token) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          success: false,
          message: "Something went wrong",
        });
      }
      if (token) {
        stripe.customers.createSource(
          customer.id,
          { source: token.id },
          async function (err, card) {
            if (err) {
              console.log(err);
              return res.status(400).send({
                success: false,
                message: "Something went wrong",
              });
            }
          }
        );
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "gbp",
      customer: customer.id,
      payment_method_types: ["card"],
    });

    const paymentIntent2 = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      { payment_method: "pm_card_visa" }
    );

    const paymentInsert = new Payment({
      senderName: senderData.first_name,
      receiverName: receiverData.first_name,
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      type: req.body.type,
      amount: req.body.amount,
      senderProfilePic: senderData.profilePicture,
      receiverProfilePic: receiverData.profilePicture,
      senderJobTitle: senderData.jobTitle,
      receiverJobTitle: receiverData.jobTitle,
      isReceive:false
    });

    await paymentInsert.save();

    return res.status(200).send({
      success: true,
      message: "Payment Inserted Successfully",
      data: paymentInsert,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const receivePayment = async (req, res) => {
  try {

    const transfer = await stripe.transfers.create({
      amount: req.body.amount,
      currency: 'usd',
      destination: req.body.accountId,
  
    })


    const updateReceive=await Payment.updateMany({receiverId:new ObjectId(req.query.receiverId)},{
      isReceive:true
    },{new:true})

    return res.status(200).send({
      success: true,
      message: "Payment Received Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { getRecord, insertPayment, receivePayment };
