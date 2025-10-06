// Client/src/pages/CodeEditor/CodeEditor.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/store';
import { useSocket } from "@/context/SocketContext";
import MonacoEditor from "../../components/code-editor/MonacoEditor";
import LiveUsers from "../../components/code-editor/LiveUsers";
import LoginModal from "./LoginModal";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ShareIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import apiClient from "../../lib/apiClient";

const CodeEditor = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { userInfo } = useStore();
  const {
    initializeCodeSocket,
    disconnectCodeSocket,
    emitCode,
    codeConnectionState,
  } = useSocket();
  const currentUserId = userInfo?.id || userInfo?._id;

  // Socket and connection states
  const [codeSocket, setCodeSocket] = useState(null);
  const isConnected = codeConnectionState === "connected";

  // Session and editor states
  const [sessionData, setSessionData] = useState(null);
  const [code, setCode] = useState(
    '// Welcome to TechTalke Code Collaboration\n// Start coding together!\nconsole.log("Hello, World!");'
  );
  const [language, setLanguage] = useState("javascript");
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());

  // UI states
  const [showLoginModal, setShowLoginModal] = useState(!userInfo);
  const [showCreateSession, setShowCreateSession] = useState(!sessionId);
  const [newSessionTitle, setNewSessionTitle] = useState("");

  // Refs for managing updates
  const lastRemoteUpdate = useRef(0);
  const isUpdatingFromRemote = useRef(false);
  const typingTimeoutRef = useRef(null);

  // Initialize code collaboration socket
  useEffect(() => {
    if (userInfo && sessionId) {
      console.log("🔌 Initializing code socket for session:", sessionId);

      const socket = initializeCodeSocket(sessionId);
      if (socket) {
        setCodeSocket(socket);
        setupCodeSocketEvents(socket);
      }

      return () => {
        console.log("🧹 Cleaning up code socket...");
        disconnectCodeSocket();
        setCodeSocket(null);
      };
    }
  }, [userInfo, sessionId]);

  const setupCodeSocketEvents = (socket) => {
    // Session events
    socket.on("session-joined", (data) => {
      console.log("🎯 Successfully joined session:", data);
      console.log("📝 Received code length:", data.code?.length);

      isUpdatingFromRemote.current = true;
      setCode(data.code || "");
      setLanguage(data.language || "javascript");
      setParticipants(data.participants || []);

      setTimeout(() => {
        isUpdatingFromRemote.current = false;
      }, 500);

      toast.success("Successfully joined collaboration session!");
    });

    socket.on("error", (error) => {
      console.error("❌ Session error:", error);
      toast.error(error.message || "Session error occurred");
    });

    // Real-time collaboration events
    socket.on("code-update", (data) => {
      console.log("📝 Received code update from user:", data.userId);
      console.log("📝 New code length:", data.code?.length);
      console.log("📝 Current user ID:", currentUserId);
      console.log("📝 Sender socket ID:", data.socketId);
      console.log("📝 My socket ID:", socket.id);

      // Only apply if it's not from current user
      if (data.userId !== currentUserId && data.socketId !== socket.id) {
        console.log("✅ Applying remote code update");
        isUpdatingFromRemote.current = true;
        lastRemoteUpdate.current = data.timestamp || Date.now();
        setCode(data.code || "");

        setTimeout(() => {
          isUpdatingFromRemote.current = false;
        }, 200);
      } else {
        console.log("⏭️ Skipping own code update");
      }
    });

    socket.on("participants-update", (newParticipants) => {
      console.log("👥 Participants updated:", newParticipants);
      setParticipants(newParticipants || []);
    });

    socket.on("user-joined", (user) => {
      console.log("👋 User joined:", user.username);
      toast.success(`${user.username} joined the session`);
    });

    socket.on("user-left", (data) => {
      console.log("👋 User left:", data.userId);
      setParticipants((prev) => prev.filter((p) => p.userId !== data.userId));
    });

    socket.on("cursor-update", (data) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.userId === data.userId ? { ...p, cursor: data.position } : p
        )
      );
    });

    socket.on("user-typing", (data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    socket.on("language-update", (data) => {
      setLanguage(data.language);
      toast.info(`Language changed to ${data.language}`);
    });

    // Health check
    socket.on("pong", (data) => {
      console.log("🏓 Code socket health check OK", data);
    });
  };

  // Load session data
  useEffect(() => {
    if (sessionId && userInfo) {
      loadSession();
    }
  }, [sessionId, userInfo]);

  const loadSession = async () => {
    try {
      const response = await apiClient.get(`/api/code/join/${sessionId}`);
      if (response.data.success) {
        const session = response.data.session;
        setSessionData(session);

        // Only set initial code if socket hasn't loaded it yet
        if (!isConnected) {
          setCode(session.code || "");
          setLanguage(session.language || "javascript");
        }

        setShowCreateSession(false);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
      toast.error("Failed to load session");
    }
  };

  const createNewSession = async () => {
    if (!newSessionTitle.trim()) return;

    try {
      const response = await apiClient.post("/api/code/create-session", {
        title: newSessionTitle,
        language: language,
        isPublic: false,
      });

      if (response.data.success) {
        const newSessionId = response.data.session.sessionId;
        navigate(`/code-editor/${newSessionId}`);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create session");
    }
  };

  // Handle code changes with proper synchronization
  const handleCodeChange = (newCode, changes, timestamp) => {
    console.log("📝 Local code change detected");
    console.log("📝 Is updating from remote:", isUpdatingFromRemote.current);
    console.log("📝 New code length:", newCode?.length);
    console.log("📝 Socket connected:", isConnected);

    // Skip if this is a remote update
    if (isUpdatingFromRemote.current) {
      console.log("⏭️ Skipping local change (remote update in progress)");
      return;
    }

    // Check if this is too close to a recent remote update
    if (timestamp && timestamp <= lastRemoteUpdate.current + 500) {
      console.log("⏭️ Skipping local change (too close to remote update)");
      return;
    }

    setCode(newCode);

    // Emit to code socket
    if (isConnected && sessionId) {
      console.log("📡 Emitting code change to server");

      const success = emitCode("code-change", {
        sessionId,
        code: newCode,
        changes,
        userId: currentUserId,
        timestamp: Date.now(),
      });

      if (!success) {
        console.log("⚠️ Failed to emit code change - socket not ready");
      }

      // Handle typing indicators
      emitCode("typing-start", { sessionId });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        emitCode("typing-stop", { sessionId });
      }, 2000);
    } else {
      console.log("⚠️ Cannot emit code change - not connected or no session");
      console.log("⚠️ Connected:", isConnected);
      console.log("⚠️ Session ID:", sessionId);
    }
  };

  const handleCursorChange = (position) => {
    if (isConnected && sessionId) {
      emitCode("cursor-move", {
        sessionId,
        position,
        userId: currentUserId,
      });
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);

    if (isConnected && sessionId) {
      emitCode("language-change", {
        sessionId,
        language: newLanguage,
      });
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await apiClient.post("/auth/login", loginData);
      if (response.data.success) {
        useStore.getState().setUserInfo(response.data.user);
        toast.success("Logged in successfully");
        setShowLoginModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login failed:", error);
    }
  };

  const copySessionLink = () => {
    if (sessionId) {
      const link = `${window.location.origin}/code-editor/${sessionId}`;
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast.success("Session link copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy link to clipboard");
        });
    }
  };

  // Connection health check
  useEffect(() => {
    if (codeSocket && isConnected) {
      const healthCheck = setInterval(() => {
        emitCode("ping");
      }, 30000);

      return () => {
        clearInterval(healthCheck);
      };
    }
  }, [codeSocket, isConnected]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "typescript", label: "TypeScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
  ];

  if (!userInfo) {
    return (
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    );
  }

  // Create Session Modal
  if (showCreateSession) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-48 h-48 bg-gradient-to-br from-cyan-500/15 to-emerald-500/15 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 25, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/70 backdrop-blur-2xl rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 p-8 w-full max-w-md mx-4 relative overflow-hidden"
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none rounded-3xl" />

          {/* Background code icon */}
          <div className="absolute -right-12 -top-12 opacity-5 z-0">
            <CodeBracketIcon className="w-48 h-48 text-emerald-400" />
          </div>

          {/* Glowing corners */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <div
            className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          <motion.h2
            className="text-3xl font-bold text-white mb-2 text-center relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-slate-400 to-cyan-400 bg-clip-text text-transparent">
              Create Code Session
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-300 text-center mb-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Start collaborating with your team
          </motion.p>

          <div className="space-y-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-white font-medium mb-3 block">
                Session Title
              </label>
              <input
                type="text"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-slate-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter session name..."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-white font-medium mb-3 block">
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-slate-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
              >
                {languages.map((lang) => (
                  <option
                    key={lang.value}
                    value={lang.value}
                    className="bg-gray-800 text-white"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              className="flex space-x-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => navigate("/chat")}
                className="flex-1 py-4 px-6 rounded-xl font-medium bg-gray-700/50 hover:bg-gray-700 text-white transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={createNewSession}
                disabled={!newSessionTitle.trim()}
                className="flex-1 py-4 px-6 rounded-xl font-medium bg-gradient-to-r from-slate-500 to-cyan-500 hover:from-slate-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Session
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex flex-col relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-900/10 to-cyan-900/10 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="bg-gray-900/60 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-4 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("/chat")}
              className="p-3 text-gray-400 hover:text-emerald-400 transition-colors rounded-xl hover:bg-gray-800/50 border border-transparent hover:border-emerald-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </motion.button>

            <div>
              <motion.h1
                className="text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {sessionData?.title || (
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    CodeSync Studio
                  </span>
                )}
              </motion.h1>
              <motion.div
                className="flex items-center space-x-3 text-sm text-gray-300 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-emerald-400" : "bg-red-400"
                    } animate-pulse`}
                  />
                  <span>{isConnected ? "Connected" : "Connecting..."}</span>
                </div>
                {sessionId && (
                  <span className="text-gray-400">
                    • Session: {sessionId.substring(0, 8)}...
                  </span>
                )}
                {typingUsers.size > 0 && (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <span>•</span>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    <span>
                      {typingUsers.size} user{typingUsers.size > 1 ? "s" : ""}{" "}
                      typing
                    </span>
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-800/70 text-white px-4 py-2 rounded-lg border border-gray-600/50 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 backdrop-blur-sm transition-all duration-200"
            >
              {languages.map((lang) => (
                <option
                  key={lang.value}
                  value={lang.value}
                  className="bg-gray-800"
                >
                  {lang.label}
                </option>
              ))}
            </select>

            {/* Share Button */}
            {sessionId && (
              <motion.button
                onClick={copySessionLink}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DocumentDuplicateIcon className="w-4 h-4" />
                <span>Share</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Code Editor */}
        <motion.div
          className="flex-1 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="h-full bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl shadow-emerald-500/10">
            <MonacoEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
              participants={participants}
              onCursorChange={handleCursorChange}
              socket={codeSocket}
              sessionId={sessionId}
              currentUserId={currentUserId}
            />
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="w-80 p-6 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Live Users */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
          >
            <LiveUsers participants={participants} typingUsers={typingUsers} />
          </motion.div>

          {/* Connection Status */}
          <motion.div
            className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-emerald-400" : "bg-red-400"
                } animate-pulse`}
              />
              <span>Connection Status</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Status:</span>
                <span
                  className={`font-medium ${
                    isConnected ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Participants:</span>
                <span className="text-white font-medium">
                  {participants.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Language:</span>
                <span className="text-cyan-400 font-medium">{language}</span>
              </div>
              {codeSocket && (
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">Socket ID:</span>
                  <span className="text-gray-400 text-xs font-mono">
                    {codeSocket.id?.substring(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Debug Info (Remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <motion.div
              className="bg-yellow-900/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-700/30 shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-yellow-400 font-semibold mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span>Debug Info</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-yellow-900/10 rounded">
                  <span className="text-gray-400">Socket Connected:</span>
                  <span
                    className={
                      codeSocket?.connected
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {codeSocket?.connected ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-900/10 rounded">
                  <span className="text-gray-400">Code Length:</span>
                  <span className="text-white">{code?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-900/10 rounded">
                  <span className="text-gray-400">Last Update:</span>
                  <span className="text-white font-mono text-xs">
                    {new Date(lastRemoteUpdate.current).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-900/10 rounded">
                  <span className="text-gray-400">Updating:</span>
                  <span
                    className={
                      isUpdatingFromRemote.current
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    {isUpdatingFromRemote.current ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-900/10 rounded">
                  <span className="text-gray-400">Connection State:</span>
                  <span className="text-white font-mono text-xs">
                    {codeConnectionState}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CodeEditor;