import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// this  function is used to send mail
async function sendEmail(to, subject, htmlContent) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html:htmlContent,      
    });
    console.log("Email send suceddful");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.send({ msg: "Username already Exist!" });
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.send({ msg: "Try to other email" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    const htmlContent = `
      <html>
        <head>
          <style>
            .heading{
              color: blue;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1 className="heading">Welcome to our Staying!</h1>
          <p>You have successfully registered and your time to search Hotel is our first priority.</p>
        </body>
      </html>
    `;

    await sendEmail(
      email,
      "Registration Successful",
      htmlContent
    );

    res.status(201).send({ msg: "User has been created!" });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).send({ msg: "Registration failed!" });
  }
};

export const login = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.send({ message: "User not found!" });
    }

    const ispasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!ispasswordCorrect) {
      return res.send({ message: "Wrong Password or Username!" });
    }
    const diffInMilliseconds = Math.abs(currentDate - user.createdAt);
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const passwordExpIn = 28 - diffInDays;

    // console.log(`Password has been created ${diffInDays} ,${passwordExpIn} days ago`);

    if (passwordExpIn <= 1) {
      await sendEmail(
        user.email,
        "Password Reset",
        "Please reset your password"
      );
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token,passwordExpIn, { httpOnly: true })
      .status(200)
      .send({ ...otherDetails });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating the user.");
  }
};
