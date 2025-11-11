const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const isUserAlreadyExists = await userModel.find({ email });

  if (isUserAlreadyExists) {
    return res.status(401).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User created successfully",
    email,
    _id: user._id,
    fullName: user.fullName,
  });
}

module.exports = { registerUser };
