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

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.find({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({
      message: "Invalid Password",
    });
  }

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    _id: user._id,
    fullName: user.fullName,
  });
}

module.exports = { registerUser, loginUser };
