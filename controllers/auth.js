import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Error creating the user.");
  }
};

export const login = async (req, res, next) => {
  try {
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

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .send({ ...otherDetails });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Error creating the user.");
  }
};
