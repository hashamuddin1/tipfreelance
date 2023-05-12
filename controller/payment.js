const { Payment } = require("../model/payment");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const { users } = require("../model/user");
const { AvailiblePayment } = require("../model/availiblePayment");
const stripe = require("stripe")(process.env.Secret_Key);

const getRecord = async (req, res) => {
  try {
    if (req.query.firstName) {
      if (req.query.senderId) {
        let totalPayment = 0;
        let todayTotalPayment = 0;
        var date = new Date();
        var dateString = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];

        const fetchPayment = await Payment.find({
          senderId: new ObjectId(req.query.senderId),
          receiverName: { $regex: new RegExp(req.query.firstName, "i") },
          date: { $lt: `${dateString}T00:00:00.000+00:00` },
        }).select({
          _id: 1,
          senderName: 1,
          receiverName: 1,
          senderId: 1,
          receiverId: 1,
          senderProfilePic: 1,
          receiverProfilePic: 1,
          senderJobTitle: 1,
          receiverJobTitle: 1,
          type: 1,
          amount: 1,
          isReceive: 1,
          gifImage: 1,
          note: 1,
          date: 1,
        });

        const fetchPaymentToday = await Payment.find({
          senderId: new ObjectId(req.query.senderId),
          receiverName: { $regex: new RegExp(req.query.firstName, "i") },
          date: { $gte: `${dateString}T00:00:00.000+00:00` },
        });
        for (i = 0; i < fetchPayment.length; i++) {
          totalPayment += fetchPayment[i].amount;
        }
        for (i = 0; i < fetchPaymentToday.length; i++) {
          todayTotalPayment += fetchPaymentToday[i].amount;
        }
        return res.status(200).send({
          success: true,
          message: "All Payment Record",
          TotalPayment: totalPayment,
          todayTotalPayment: todayTotalPayment,
          todayPayment: fetchPaymentToday,
          data: fetchPayment,
        });
      }

      if (req.query.receiverId) {
        let totalPayment = 0;
        let todayTotalPayment = 0;
        let totalAvailible = 0;
        var date = new Date();
        var dateString = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        const fetchPayment = await Payment.find({
          receiverId: new ObjectId(req.query.receiverId),
          senderName: { $regex: new RegExp(req.query.firstName, "i") },
          date: { $lt: `${dateString}T00:00:00.000+00:00` },
        });
        const fetchPaymentToday = await Payment.find({
          receiverId: new ObjectId(req.query.receiverId),
          senderName: { $regex: new RegExp(req.query.firstName, "i") },
          date: { $gte: `${dateString}T00:00:00.000+00:00` },
        });

        const fetchPaymentWithdraw = await Payment.find({
          receiverId: new ObjectId(req.query.receiverId),
          senderName: { $regex: new RegExp(req.query.firstName, "i") },
          isReceive: false,
        });
        for (i = 0; i < fetchPayment.length; i++) {
          totalPayment += fetchPayment[i].amount;
        }
        for (i = 0; i < fetchPaymentToday.length; i++) {
          todayTotalPayment += fetchPaymentToday[i].amount;
        }
        for (i = 0; i < fetchPaymentWithdraw.length; i++) {
          totalAvailible += fetchPaymentWithdraw[i].amount;
        }
        return res.status(200).send({
          success: true,
          message: "All Payment Record",
          TotalPayment: totalPayment,
          todayTotalPayment: todayTotalPayment,
          totalAvailible: totalAvailible,
          todayPayment: fetchPaymentToday,
          data: fetchPayment,
        });
      }
    }
    if (req.query.senderId) {
      let totalPayment = 0;
      let todayTotalPayment = 0;
      var date = new Date();
      var dateString = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )

        .toISOString()
        .split("T")[0];

      const fetchPayment = await Payment.find({
        senderId: new ObjectId(req.query.senderId),
        date: { $lt: `${dateString}T00:00:00.000+00:00` },
      }).select({
        _id: 1,
        senderName: 1,
        receiverName: 1,
        senderId: 1,
        receiverId: 1,
        senderProfilePic: 1,
        receiverProfilePic: 1,
        senderJobTitle: 1,
        receiverJobTitle: 1,
        type: 1,
        amount: 1,
        isReceive: 1,
        gifImage: 1,
        note: 1,
        date: 1,
      });

      const fetchPaymentToday = await Payment.find({
        senderId: new ObjectId(req.query.senderId),
        date: { $gte: `${dateString}T00:00:00.000+00:00` },
      });
      for (i = 0; i < fetchPayment.length; i++) {
        totalPayment += fetchPayment[i].amount;
      }
      for (i = 0; i < fetchPaymentToday.length; i++) {
        todayTotalPayment += fetchPaymentToday[i].amount;
      }
      return res.status(200).send({
        success: true,
        message: "All Payment Record",
        TotalPayment: totalPayment,
        todayTotalPayment: todayTotalPayment,
        todayPayment: fetchPaymentToday,
        data: fetchPayment,
      });
    }

    if (req.query.receiverId) {
      let totalPayment = 0;
      let todayTotalPayment = 0;

      var date = new Date();
      var dateString = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      const fetchPayment = await Payment.find({
        receiverId: new ObjectId(req.query.receiverId),
        date: { $lt: `${dateString}T00:00:00.000+00:00` },
      });
      const fetchPaymentToday = await Payment.find({
        receiverId: new ObjectId(req.query.receiverId),
        date: { $gte: `${dateString}T00:00:00.000+00:00` },
      });

      for (i = 0; i < fetchPayment.length; i++) {
        totalPayment += fetchPayment[i].amount;
      }
      for (i = 0; i < fetchPaymentToday.length; i++) {
        todayTotalPayment += fetchPaymentToday[i].amount;
      }

      let totalAvailible;

      const fetchReceiverID = await AvailiblePayment.findOne({
        receiverId: req.query.receiverId,
      });

      if (fetchReceiverID == null) {
        totalAvailible = 0;
      }else{
        totalAvailible=fetchReceiverID.amount
      }

      return res.status(200).send({
        success: true,
        message: "All Payment Record",
        TotalPayment: totalPayment,
        todayTotalPayment: todayTotalPayment,
        totalAvailible: totalAvailible,
        todayPayment: fetchPaymentToday,
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
      { payment_method: req.body.payment_method }
    );

    var date = new Date();

    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    if (!req.file) {
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
        date: `${dateString}T${hours}:${minutes}:${seconds}`,
        isReceive: false,
        note: req.body.note,
      });

      await paymentInsert.save();

      const fetchReceiverID = await AvailiblePayment.findOne({
        receiverId: req.body.receiverId,
      });

      if (fetchReceiverID != null) {
        const availiblePaymentUpdate = await AvailiblePayment.findOneAndUpdate(
          { receiverId: req.body.receiverId },
          { $inc: { amount: req.body.amount } },
          { new: true }
        );
      } else {
        const availiblePaymentInsert = new AvailiblePayment({
          receiverId: req.body.receiverId,
          amount: req.body.amount,
        });

        await availiblePaymentInsert.save();
      }

      return res.status(200).send({
        success: true,
        message: "Payment Inserted Successfully",
        data: paymentInsert,
      });
    }
    if (req.file) {
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
        isReceive: false,
        date: `${dateString}T${hours}:${minutes}:${seconds}`,
        gifImage: "https://tippee.herokuapp.com/" + req.file.path,
        note: req.body.note,
      });
      await paymentInsert.save();

      const fetchReceiverID = await AvailiblePayment.findOne({
        receiverId: req.body.receiverId,
      });

      if (fetchReceiverID != null) {
        const availiblePaymentUpdate = await AvailiblePayment.findOneAndUpdate(
          { receiverId: req.body.receiverId },
          { $inc: { amount: req.body.amount } },
          { new: true }
        );
      } else {
        const availiblePaymentInsert = new AvailiblePayment({
          receiverId: req.body.receiverId,
          amount: req.body.amount,
        });

        await availiblePaymentInsert.save();
      }

      return res.status(200).send({
        success: true,
        message: "Payment Inserted Successfully",
        data: paymentInsert,
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

const receivePayment = async (req, res) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: req.body.amount,
      currency: "usd",
      destination: req.body.accountId,
    });

    const updateReceive = await Payment.updateMany(
      { receiverId: new ObjectId(req.query.receiverId) },
      {
        isReceive: true,
      },
      { new: true }
    );

    const availiblePaymentUpdate = await AvailiblePayment.findOneAndUpdate(
      { receiverId: req.query.receiverId },
      { $inc: { amount: -req.body.amount } },
      { new: true }
    );

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
