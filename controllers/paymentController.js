import { instance } from "../index.js";
import crypto from "crypto";
import Payment from "../models/PaymentSchema.js"
import 'dotenv/config';

//create order

export const checkOut = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100), // convert in paise
    currency: "INR",
  };
  // console.log(options, "kjh")
  try {
    const order = await instance.orders.create(options);
    // console.log(order)
    // console.log(order)
    res.status(200).json({ sucess: true, order });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "Server Error" });
  }
};


export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(req.body, "678oiuyfcvbn")

  try {
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
    const generated_signature = hmac.update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

    const isAuth = generated_signature === razorpay_signature;
    if (isAuth) {
      // Save to MongoDB
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      // Redirect on success
      return res.redirect(`https://payment-gateway-api-iota.vercel.app/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
      res.status(400).json({ success: false, message: "Verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};