const User = require("../../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();


const hashPassword = async(password) => {
  const hashedPassword = await bcrypt.hash(password,saltRounds);
  return hashedPassword;
};

const generateToken =  (user)=>{
  const payload = {
    id: user._id,
    username: user.username,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET,{
    expiresIn:"1h",
  });
  return token;
};

exports.signup = async (req, res) => {
  try {
    const {password} = req.body;
    const newPassword = await hashPassword(password);
    req.body.password = newPassword;
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    return res.status(201).json({token: token});
    // res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res) => {
  try {
    const token = await generateToken(req.user);
    return res.status(200).json({token: token})
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
