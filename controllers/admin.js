// Import necessary libraries and modules
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Admin login API
export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).send({ message: "Access denied. Not an admin!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Wrong Password or Username!" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password: _, isAdmin, ...otherDetails } = user._doc;

    res.cookie("access_token", token, { httpOnly: true })
      .status(200)
      .send({ ...otherDetails });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during admin login.");
  }
};
