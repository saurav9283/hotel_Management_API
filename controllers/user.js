import User from "../models/User.js";


export const updatedUsers = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.json(error);
  }
};

export const deleteUsers = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json("User has been deleted.");
  } catch (error) {
    res.json(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
