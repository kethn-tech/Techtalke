const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    const data = await User.findOne({ email });

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { email: data.email, id: data._id.toString(), role: data.role },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    // 🔧 FIXED: Cross-site cookie settings for Vercel<->Render
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always true for HTTPS (required for production)
      sameSite: "none", // Required for cross-site cookies
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    console.log(`✅ User logged in: ${data.email} (Role: ${data.role})`);

    return res.status(200).json({
      success: true,
      user: {
        _id: data._id,
        email: data.email,
        role: data.role,
        profileSetup: data.profileSetup,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
        color: data.color,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    console.log("User ID from middleware: ", req.id);

    const user = await User.findById(req.id);
    if (!user) {
      console.log("No user found with ID:", req.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (err) {
    console.error("Error in getUserInfo:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logOut = async (req, res) => {
  try {
    // 🔧 FIXED: Cross-site cookie clearing
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // Always true for HTTPS
      sameSite: "none", // Required for cross-site cookies
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
};

const githubAuth = (req, res) => {
  // 🔧 FIXED: Use server URL from environment
  const redirectUri = encodeURIComponent(
    `${req.protocol}://${req.get("host")}/api/auth/github/callback`
  );
  const clientId = process.env.GITHUB_CLIENT_ID;
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  res.redirect(githubUrl);
};

const githubCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // 🔧 FIXED: Dynamic redirect URI
    const redirectUri = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/github/callback`;

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const emailObj = emailRes.data.find((e) => e.primary) || emailRes.data[0];
    const email = emailObj.email;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: "",
        githubId: userRes.data.id,
        role: "user",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id.toString(), role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    // 🔧 FIXED: Cross-site cookie settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // 🔧 FIXED: Redirect to CLIENT_URL from environment
    res.redirect(`${process.env.CLIENT_URL}/auth`);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    res.status(500).json({ error: "GitHub OAuth failed" });
  }
};

const linkedinAuth = (req, res) => {
  // 🔧 FIXED: Use server URL from environment
  const redirectUri = encodeURIComponent(
    `${req.protocol}://${req.get("host")}/api/auth/linkedin/callback`
  );
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const state = "randomstatestring";
  const scope = "openid profile email";
  const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${encodeURIComponent(
    scope
  )}`;
  res.redirect(linkedinUrl);
};

const linkedinCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    console.error("No code in callback!");
    return res.status(400).send("No code provided in callback.");
  }

  // 🔧 FIXED: Dynamic redirect URI
  const redirectUri = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/linkedin/callback`;

  try {
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const accessToken = tokenRes.data.access_token;

    const userInfo = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const email = userInfo.data.email;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: "",
        linkedinId: userInfo.data.sub,
        role: "user",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id.toString(), role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    // 🔧 FIXED: Cross-site cookie settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // 🔧 FIXED: Redirect to CLIENT_URL from environment
    res.redirect(`${process.env.CLIENT_URL}`);
  } catch (err) {
    console.error(
      "LinkedIn OAuth error:",
      err.response?.data || err.message || err
    );
    res.status(500).json({
      error: "LinkedIn OAuth failed",
      details: err.response?.data || err.message || err,
    });
  }
};

module.exports = {
  logIn,
  getUserInfo,
  logOut,
  githubAuth,
  githubCallback,
  linkedinAuth,
  linkedinCallback,
};
