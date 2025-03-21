const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        Error: "Please provide an email and password",
      });
    }

    const data = await User.create({ email, password });

    const token = jwt.sign(
      { email: data.email, id: data._id.toString(), role: data.role },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    // Set cookie with appropriate settings for development
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
    });

    return res.status(201).json({
      user: data,
    });

  } catch (err) {
    return res.status(500).json({
      "Internal Server Error": err,
    });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        Error: "Please provide an email and password",
      });
    }

    const data = await User.findOne({ email });

    if (!data) {
      return res.status(400).json({
        Error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(400).json({
        Error: "Wrong Password",
      });
    }

    const token = jwt.sign(
      { email: data.email, id: data._id.toString(), role: data.role },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    // Set cookie with appropriate settings for development
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
    });

    return res.status(200).json({
      user: data,
      
    });
  } catch (err) {
    return res.status(500).json({
      "Internal Server Error": err,
    });
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    // Add console log to debug the user ID
    console.log("User ID from middleware: ", req.id);
    
    const user = await User.findById(req.id);
    if(!user){
      console.log("No user found with ID:", req.id);
      return res.status(404).json({
        Error: "User not found"
      });
    }

    return res.status(200).json({
      user
    });

  } catch (err) {
    console.error("Error in getUserInfo:", err);
    return res.status(500).json({
      "Internal Server Error": err.message,
    });
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, 
      secure: false, 
      sameSite: "lax"
    });
    
    return res.status(200).json({
      message: "Logged Out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      "Internal Server Error": err,
    });
  }
};

module.exports = { signUp, logIn, getUserInfo, logOut };