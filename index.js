import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import paymentRouter from "./routes/paymentRoute.js";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

const app = express();
app.use(cors());
dotenv.config();

export const instance = new Razorpay({
  key_id : process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET
})

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Mongodb Disconnected");
});

connect();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//middlewares
app.use("/api/auth" , authRoute)
app.use("/api/users" , usersRoute)
app.use("/api/hotels" , hotelsRoute)
app.use("/api/rooms" , roomsRoute)
app.use("/api", paymentRouter);

app.get("/get_key", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
});

app.get("/" , (req, res) =>{
  res.send("Api working!")
})

app.use((err,req, res, next) =>{
  if (res.headersSent) {
    return next(err);
  }
  const errorStatus = err.message || 500
  const errorMessage = err.message || "Something went wrong!"
  return res.status(errorStatus).json({
    success:false,
    status:errorMessage,
    message:errorMessage,
    stack:err.stack
  })
})


app.listen(9000, () => {
  console.log("Connected to Backend!");
});
