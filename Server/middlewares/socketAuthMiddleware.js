const jwt = require("jsonwebtoken");

const socketAuthMiddleware = (socket, next) => {
  try {
    // Get token from socket handshake
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      console.log("⚠️ No token provided for socket connection");
      return next(new Error("Authentication required"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("⚠️ Invalid token for socket connection");
      return next(new Error("Invalid token"));
    }

    // Store user info in socket
    socket.user = decoded;
    console.log(`✅ Socket authenticated for user: ${decoded._id}`);
    next();
  } catch (error) {
    console.error("🚨 Socket authentication error:", error.message);
    next(new Error("Authentication failed"));
  }
};

module.exports = socketAuthMiddleware;
