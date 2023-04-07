const { Payment } = require("../model/payment");
require("dotenv").config();
const { ObjectId } = require("mongodb");

const getRecord = async (req, res) => {
  try {
    if (req.query.senderId) {
      const fetchPayment = await Payment.find({
        senderId: new ObjectId(req.query.senderId),
      });
      return res.status(200).send({
        success: true,
        message: "All Payment Record",
        data: fetchPayment,
      });
    }

    if (req.query.receiverId) {
      const fetchPayment = await Payment.find({
        receiverId: new ObjectId(req.query.receiverId),
      });
      return res.status(200).send({
        success: true,
        message: "All Payment Record",
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

const insertPayment=async(req,res)=>{
    try{
        const paymentInsert = new Payment({
            senderName:"sara",
            senderId: "643014a90c03754b820415b6",
            receiverId: "642fcbf02593be7e9ed3e705",
            type: "card",
            amount: 24,
          });
      
          await paymentInsert.save();
      
          return res.status(200).send({
            success: true,
            message: "Payment Inserted Successfully",
            data: paymentInsert,
          });

    }catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = { getRecord,insertPayment };
