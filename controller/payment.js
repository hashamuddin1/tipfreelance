const { Payment } = require("../model/payment");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const { users } = require("../model/user");

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

      const senderData=await users.findOne({_id:new ObjectId(req.body.senderId)})
      if(!senderData){
        return res.status(400).send({
          success: false,
          message: "Sender User Not Found",
         
        });
      }

      const receiverData=await users.findOne({_id:new ObjectId(req.body.receiverId)})
      if(!receiverData){
        return res.status(400).send({
          success: false,
          message: "Receiver User Not Found",
         
        });
      }
        const paymentInsert = new Payment({
            senderName:senderData.first_name,
            receiverName:receiverData.first_name,
            senderId: req.body.senderId,
            receiverId: req.body.receiverId,
            type:req.body.type,
            amount: req.body.amount,
            senderProfilePic: senderData.profilePicture,
            receiverProfilePic: receiverData.profilePicture,
            senderJobTitle:senderData.jobTitle,
            receiverJobTitle: receiverData.jobTitle,
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
