const express = require('express');
const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

// ✨ FIXED: Import all routes and socket handlers
const codeRoutes = require("./routes/codeRoutes");
const handleCodeCollaboration = require("./socket-handlers/codeSocket");
const handleGroupSocket = require("./socket-handlers/groupSocket");
const AuthRoute = require("./routes/AuthRoute");
const ContactRoutes = require("./routes/ContactRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoute = require("./routes/profileRoute");
const adminRoutes = require("./routes/adminRoutes");
const setupSocket = require("./socket");
const groupRoutes = require("./routes/groupRoutes");
const Setting = require("./models/SettingModel"); // Import Setting model for maintenance status



require("dotenv").config();

const app = express();

// 🛠️ Global maintenance mode middleware (must be before API routes)
const maintenanceMiddleware = require("./middlewares/MaintenanceMiddleware");
// Replace the maintenance middleware application section in your server.js with this:

// ✨ FIXED: Apply maintenance mode middleware SELECTIVELY
// The key fix is to apply it AFTER basic middleware setup but BEFORE protected routes
// Security: Set HTTP headers
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Global rate limiter (100 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Configure CORS
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');
const corsOptions = {
  origin: (origin, callback) => {
    console.log({
      origin: origin,
      allowed: allowedOrigins
    });
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS')); // block other origins
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Static file serving
app.use("/uploads/profile-images", express.static(path.join(__dirname, "uploads/profile-images")));

// Better CORS headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Cookie, Set-Cookie');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Maintenance status endpoint (must be before maintenance middleware)
app.get('/api/maintenance/status', async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json({ maintenanceMode: settings?.maintenanceMode || false });
  } catch (err) {
    console.error('Error fetching maintenance status:', err);
    res.json({ maintenanceMode: false });
  }
});

// ✨ CRITICAL FIX: Apply maintenance middleware BEFORE API routes
app.use('/api', maintenanceMiddleware);

// ✨ NOW apply your API routes (maintenance middleware will check them)
app.use('/api/auth', AuthRoute);
app.use('/api', profileRoute);
app.use('/api/contact', ContactRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/code", codeRoutes);
app.use('/api/groups', groupRoutes);
app.use("/api/gemini", require("./routes/geminiRoutes"));
app.use(
  "/api/message-suggestions",
  require("./routes/messageSuggestionRoutes")
);
app.use("/api/ai-suggestions", require("./routes/aiSuggestionRoutes"));
app.use('/api/zoro', require('./routes/zoroRoutes'));

// Health check endpoint (bypasses maintenance in the middleware itself)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'connected',
      redis: 'not configured',
      code_collaboration: 'enabled'
    }
  });
});

// Rest of your server setup remains the same...
// ✨ ENHANCED: Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip: req.ip
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// ✨ ENHANCED: 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'GET /api/auth/userInfo',
      'POST /api/code/create-session',
      'GET /api/code/join/:sessionId',
      'POST /api/code/execute'
    ]
  });
});

// Create HTTP server
const server = http.createServer(app);

/// Server/server.js - Updated sections only

// Replace the existing socket setup section with this:

// ✨ ENHANCED: Socket.io configuration with better error handling
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  },
  // ✨ Enhanced socket.io options
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowUpgrades: true,
  cookie: false,
  serveClient: false,
  allowEIO3: true
});

// Make io globally accessible for controllers
global.io = io;

// ✨ ENHANCED: Socket error handling
io.engine.on("connection_error", (err) => {
  console.error('🚨 Socket.io connection error:', {
    message: err.message,
    description: err.description,
    context: err.context,
    type: err.type,
    timestamp: new Date().toISOString()
  });
});

// Setup existing chat socket (your existing socket handling) - MAIN NAMESPACE
setupSocket(io);

// Setup Group Chat Socket
try {
  const userSocketMap = {};
  // 🌐 Make user-socket map globally accessible so REST routes can emit socket events
  global.userSocketMap = userSocketMap;
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }
    
    handleGroupSocket(io, socket, userSocketMap);
    
    socket.on('disconnect', () => {
      if (userId) {
        delete userSocketMap[userId];
      }
    });
  });
  console.log('✅ Group chat socket handlers initialized');
} catch (error) {
  console.error('🚨 Error initializing group chat socket handlers:', error);
}

// ✨ FIXED: Setup Code Collaboration Socket on /code namespace
try {
  const codeNamespace = handleCodeCollaboration(io);
  console.log('✅ Code collaboration socket handlers initialized on /code namespace');
  
  // Monitor code namespace connections
  codeNamespace.on('connection', (socket) => {
    console.log(`👤 Code client connected: ${socket.id} from ${socket.handshake.address}`);
    
    socket.on('disconnect', (reason) => {
      console.log(`👋 Code client disconnected: ${socket.id}, reason: ${reason}`);
    });

    socket.on('error', (error) => {
      console.error(`🚨 Code socket error for ${socket.id}:`, error);
    });
  });

  // Setup Coffee Break Socket
  const handleCoffeeBreakSocket = require('./socket-handlers/coffeeBreakSocket');
  const coffeeBreakNamespace = handleCoffeeBreakSocket(io);
  console.log('✅ Coffee break socket handlers initialized on /coffee-break namespace');
  
} catch (error) {
  console.error('❌ Failed to initialize code collaboration:', error.message);
}

// ✨ ENHANCED: Connection monitoring for MAIN namespace only
io.on('connection', (socket) => {
  console.log(`👤 Chat client connected: ${socket.id} from ${socket.handshake.address}`);
  
  socket.on('disconnect', (reason) => {
    console.log(`👋 Chat client disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on('error', (error) => {
    console.error(`🚨 Chat socket error for ${socket.id}:`, error);
  });
});

// Rest of your server setup remains the same...

// Connect to database
dbConnect();

// ✨ ENHANCED: Server startup with better logging
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log('🚀 TechTalke Server Started!');
  console.log('=' * 50);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/message`);
  console.log(`👤 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`💻 Code Collaboration: http://localhost:${PORT}/api/code`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.io enabled for real-time features`);
  console.log('=' * 50);
});

// ✨ ENHANCED: Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📤 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📤 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// ✨ ENHANCED: Unhandled error catching
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Promise Rejection:', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString()
  });
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // Graceful shutdown on uncaught exception
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app; // Export for testing